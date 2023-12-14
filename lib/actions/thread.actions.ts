"use server";

import { revalidatePath } from "next/cache";

import { connectToDB } from "../mongoose";

import User from "../models/user.model";
import Thread from "../models/thread.model";
import Community from "../models/community.model";
import { threadId } from "worker_threads";


interface Params {
  text: string,
  author: string,
  path: string,
  likes: Array<any>
}

export async function createBlog({ text, author, path, likes }: Params
) {
  try {
    connectToDB();

   

    const createdBlog = await Thread.create({
      text,
      author,
      likes
    });
    

    // Update User model
    await User.findByIdAndUpdate(author, {
      $push: { threads: createdBlog._id },
    });

    

    revalidatePath(path); //ensures changes update automatically
  } catch (error: any) {
    throw new Error(`Failed to create blog: ${error.message}`);
  }
}

export async function deleteBlog(id: string, path: string): Promise<void> {
  try {
    connectToDB();

    // Find the thread to be deleted (the main thread)
    const mainThread = await Thread.findById(id).populate("author");

    if (!mainThread) {
      throw new Error("Blog cannot be found");
    }

    // Fetch all child threads and their descendants recursively
    const descendantThreads = await fetchAllChildThreads(id);

    // Get all descendant thread IDs including the main thread ID and child thread IDs
    const descendantThreadIds = [
      id,
      ...descendantThreads.map((thread) => thread._id),
    ];

    // Extract the authorIds to update User and Community models respectively
    const uniqueAuthorIds = new Set(
      [
        ...descendantThreads.map((thread) => thread.author?._id?.toString()), // Use optional chaining to handle possible undefined values
        mainThread.author?._id?.toString(),
      ].filter((id) => id !== undefined)
    );



    // Recursively delete child threads and their descendants
    await Thread.deleteMany({ _id: { $in: descendantThreadIds } });

    // Update User model
    await User.updateMany(
      { _id: { $in: Array.from(uniqueAuthorIds) } },
      { $pull: { threads: { $in: descendantThreadIds } } }
    );

   

    revalidatePath(path);
  } catch (error: any) {
    throw new Error(`Failed to delete blog: ${error.message}`);
  }
}


export async function getBlogs(pageNumber = 1, pageSize = 30) {
  connectToDB();

  // calculate number of posts to skip based on the page number size
  const skipAmount = (pageNumber - 1) * pageSize;

  // create a query to fetch the posts that have no parent (An original post not a reply)
  const postsQuery = Thread.find({ parentId: { $in: [null, undefined] } })
    .sort({ createdAt: "desc" })
    .skip(skipAmount)
    .limit(pageSize)
    .populate({
      path: "author",
      model: User,
    })
    .populate({
      path: "children", // Populate the children field
      populate: {
        path: "author", // Populate the author field within children
        model: User,
        select: "_id name parentId image", // Select only _id and username fields of the author
      },
    });

  // Count the total number of top-level posts (Blogs) i.e., threads that are not comments.
  const totalPostsCount = await Thread.countDocuments({
    parentId: { $in: [null, undefined] },
  }); // Get the total count of posts

  const posts = await postsQuery.exec();

  const isNext = totalPostsCount > skipAmount + posts.length;

  return { posts, isNext };
}

async function fetchAllChildThreads(threadId: string): Promise<any[]> {
  const childThreads = await Thread.find({ parentId: threadId });

  const descendantThreads = [];
  for (const childThread of childThreads) {
    const descendants = await fetchAllChildThreads(childThread._id);
    descendantThreads.push(childThread, ...descendants);
  }

  return descendantThreads;
}



export async function fetchBlogById(threadId: string) {
  connectToDB();

  try {
    const blog = await Thread.findById(threadId)
      .populate({
        path: "author",
        model: User,
        select: "_id id name image",
      }) // Populate the author field with _id and username
      
      .populate({
        path: "children", // Populate the children field
        populate: [
          {
            path: "author", // Populate the author field within children
            model: User,
            select: "_id id name parentId image", // Select only _id and username fields of the author
          },
          {
            path: "children", // Populate the children field within children
            model: Thread, // The model of the nested children (assuming it's the same "Thread" model)
            populate: {
              path: "author", // Populate the author field within nested children
              model: User,
              select: "_id id name parentId image", // Select only _id and username fields of the author
            },
          },
        ],
      })
      .exec();

    return blog;
  } catch (err) {
    console.error("Error while fetching thread:", err);
    throw new Error("Unable to fetch thread");
  }
}

export async function addCommentToBlog(
  threadId: string,
  commentText: string,
  userId: string,
  path: string
) {
  connectToDB();

  try {
    // Find the original blog by its ID
    const originalBlog = await Thread.findById(threadId);

    if (!originalBlog) {
      throw new Error("Blog not found");
    }

    // Create the new comment thread
    const commentBlog = new Thread({
      text: commentText,
      author: userId,
      parentId: threadId, // Set the parentId to the original blog's ID
    });

    // Save the comment thread to the database
    const savedcommentBlog = await commentBlog.save();

    // Add the comment blogs ID to the original blogs children array
    originalBlog.children.push(savedcommentBlog._id);

    // Save the updated original blog to the database
    await originalBlog.save();

    revalidatePath(path);
  } catch (err) {
    console.error("Error adding the comment:", err);
    throw new Error("Attempt to add comment failed");
  }
}


export async function addLikeToBlog(
  threadId: string,
  userId: string,
  path: string
) {
  
  connectToDB()

  try {
    const blogToLike = await Thread.findById(threadId)

    if (!blogToLike) {
        throw new Error("Thread not found");
        
    }

    const userHasLikedPost = blogToLike.likes.includes(userId)
    
    if(!blogToLike.likes){
      blogToLike.likes = [];
    }

    if(userHasLikedPost){
      blogToLike.likes.pop(userId)
    }
    else{
      blogToLike.likes.push(userId)
    }
    
    await blogToLike.save()
    revalidatePath(path);
  } catch (error: any) {
    throw new Error(`Error adding like to blog: ${error.message}`);
  }
}

export async function retrieveThreadLikes(
  threadId: string,
  likes: Array<any>
) {
  try{
    console.log("retrieving threads")
    const threadToRetrieve = await Thread.findById(threadId);
    console.log("Like non-null, retrieving from db.")
    threadToRetrieve.Likes.forEach((like: any) => {
      likes.push(like);
    });
  } catch (exception){
    console.warn(exception)
    likes = [];
    console.log("Likes was null, initialised array.")
  }
  return (likes as Array<any>);
}