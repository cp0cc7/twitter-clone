"use server";

import { revalidatePath } from "next/cache";

import { connectToDB } from "../mongoose";

import User from "../models/user.model";
import Thread from "../models/thread.model";


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
    

    await User.findByIdAndUpdate(author, {
      $push: { threads: createdBlog._id },
    });

    

    revalidatePath(path); 
  } catch (error: any) {
    throw new Error(`Failed to create blog: ${error.message}`);
  }
}

export async function deleteBlog(id: string, path: string): Promise<void> {
  try {
    connectToDB();


    const mainBlog = await Thread.findById(id).populate("author");

    if (!mainBlog) {
      throw new Error("Blog cannot be found");
    }

    const descendantThreads = await fetchAllChildThreads(id);

  
    const descendantThreadIds = [
      id,
      ...descendantThreads.map((thread) => thread._id),
    ];

    const uniqueAuthorIds = new Set(
      [
        ...descendantThreads.map((thread) => thread.author?._id?.toString()),
        mainBlog.author?._id?.toString(),
      ].filter((id) => id !== undefined)
    );



    
    await Thread.deleteMany({ _id: { $in: descendantThreadIds } });


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

  const skipAmount = (pageNumber - 1) * pageSize;

  const postsQuery = Thread.find({ parentId: { $in: [null, undefined] } })
    .sort({ createdAt: "desc" })
    .skip(skipAmount)
    .limit(pageSize)
    .populate({
      path: "author",
      model: User,
    })
    .populate({
      path: "children",
      populate: {
        path: "author", 
        model: User,
        select: "_id name parentId image", 
      },
    });

  const totalPostsCount = await Thread.countDocuments({
    parentId: { $in: [null, undefined] },
  }); 

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
      }) 
      
      .populate({
        path: "children", 
        populate: [
          {
            path: "author", 
            model: User,
            select: "_id id name parentId image", 
          },
          {
            path: "children",
            model: Thread,
            populate: {
              path: "author",
              model: User,
              select: "_id id name parentId image",
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
    const originalBlog = await Thread.findById(threadId);

    if (!originalBlog) {
      throw new Error("Blog not found");
    }

    const commentBlog = new Thread({
      text: commentText,
      author: userId,
      parentId: threadId,
    });

    const savedcommentBlog = await commentBlog.save();

    originalBlog.children.push(savedcommentBlog._id);

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
        throw new Error("Blog not found");
        
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

export async function retrieveBlogLikes(
  threadId: string,
  likes: Array<any>
) {
  try{
    console.log("retrieving blogs")
    const blogToRetrieve = await Thread.findById(threadId);
    console.log("Like non-null, retrieving from db.")
    blogToRetrieve.Likes.forEach((like: any) => {
      likes.push(like);
    });
  } catch (exception){
    console.warn(exception)
    likes = [];
    console.log("Likes was null, initialised array.")
  }
  return (likes as Array<any>);
}