"use server";

import { FilterQuery, SortOrder } from "mongoose";
import { revalidatePath } from "next/cache";

import Community from "../models/community.model";
import Thread from "../models/thread.model";
import User from "../models/user.model";

import { connectToDB } from "../mongoose";

export async function fetchUser(userId: string) {
  try {
    connectToDB();

    return await User.findOne({ id: userId }).populate({
      path: "communities", //not doing this anymore
      model: Community,
    });
  } catch (error: any) {
    throw new Error(`Failed to fetch user: ${error.message}`);
  }
}

export async function fetchUserFollowing(userId: string) {
  try{
    connectToDB();

    const user = await User.findOne({ id: userId})
    return user.following as Array<any>
  } catch (error: any){
    throw new Error(`Failed to fetch user data: ${error.message}`);
  }
}

export async function fetchUserFollowers(userId: string) {
  try{
    connectToDB();

    const user = await User.findOne({ id: userId})
    return user.followers as Array<any>
  } catch (error: any){
    throw new Error(`Failed to fetch user data: ${error.message}`);
  }
}

interface Params { 
  userId: string;
  username: string;
  name: string;
  bio: string;
  image: string;
  house:string;
  form: string;
  path: string;
}

export async function updateUser({
  userId,
  bio,
  name,
  path,
  username,
  house,
  form,
  image,
}: Params): Promise<void> {
  try {
    connectToDB();

    await User.findOneAndUpdate(
      { id: userId },
      {
        username: username.toLowerCase(),
        name,
        bio,
        house,
        form,
        image,
        onboarded: true,
      },
      { upsert: true } 
    );

    if (path === "/profile/edit") {
      revalidatePath(path);
    }
  } catch (error: any) {
    throw new Error(`Failed to create/update user: ${error.message}`);
  }
}

export async function followUser(userID: string, targetUserID: string){
  try{
    const thisUser = await User.findOne({ id: userID })
    const userToFollow = await User.findOne({ id: targetUserID });
    const notFollowing = !thisUser.following.includes(targetUserID)
    if(notFollowing){
      thisUser.following.push(targetUserID);
      userToFollow.followers.push(userID);
    } else {
      thisUser.following.pop(targetUserID);
      userToFollow.followers.pop(userID);
    }
    await thisUser.save();
    await userToFollow.save();
    switch(notFollowing){
      case true:
        return true;

      case false:
        return false;

    }
  } catch(err) {
    throw new Error("could not follow user");
  }
  
}

export async function fetchUserPosts(userId: string) {
  try {
    connectToDB();

    const threads = await User.findOne({ id: userId }).populate({
      path: "threads",
      model: Thread,
      populate: [
        {
          path: "community",
          model: Community,
          select: "name id image _id", // ignoreeeeeee
        },
        {
          path: "children",
          model: Thread,
          populate: {
            path: "author",
            model: User,
            select: "name image id", 
          },
        },
      ],
    });
    return threads;
  } catch (error) {
    console.error("Error fetching user threads:", error);
    throw error;
  }
}

export async function fetchUserThreads(userId:string) {
  try {
      const threads = await User.findOne({ id: userId }).populate({
          path: "threads",
          model: Thread,
          populate: [
          //   {
          //     path: "community",
          //     model: Community,
          //     select: "name id image _id", 
          //   },
            {
              path: "children",
              model: Thread,
              populate: {
                path: "author",
                model: User,
                select: "name image id", 
              },
            },
          ],
        });
      return threads;
    
  } catch (error: any) {
      throw new Error(`Failed to fetch user posts: ${error.message}`)
  }
}




export async function fetchUsers({
  userId,
  searchString = "",
  pageNumber = 1,
  pageSize = 20,
  sortBy = "desc",
}: {
  userId: string;
  searchString?: string;
  pageNumber?: number;
  pageSize?: number;
  sortBy?: SortOrder;
}) {
  try {
    connectToDB();

    const skipAmount = (pageNumber - 1) * pageSize;

    const regex = new RegExp(searchString, "i");

    const query: FilterQuery<typeof User> = {
      id: { $ne: userId }, //current user doesnt show up
    };

    if (searchString.trim() !== "") {
      query.$or = [
        { username: { $regex: regex } },
        { name: { $regex: regex } },
      ];
    }

    const sortOptions = { createdAt: sortBy };

    const usersQuery = User.find(query)
      .sort(sortOptions)
      .skip(skipAmount)
      .limit(pageSize);

    const totalUsersCount = await User.countDocuments(query);

    const users = await usersQuery.exec();

    const isNext = totalUsersCount > skipAmount + users.length;

    return { users, isNext };
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
}

export async function getActivity(userId: string) {
  try {
    connectToDB();

    const userThreads = await Thread.find({ author: userId });

    const childThreadIds = userThreads.reduce((acc, userThread) => {
      return acc.concat(userThread.children);
    }, []);

    const replies = await Thread.find({
      _id: { $in: childThreadIds },
      author: { $ne: userId },
    }).populate({
      path: "author",
      model: User,
      select: "name image _id",
    });

    return replies;
  } catch (error) {
    console.error("Error fetching replies: ", error);
    throw error;
  }
}