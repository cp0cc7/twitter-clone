"use server";

import { revalidatePath } from "next/cache";

import { connectToDB } from "../mongoose";

import Event from "../models/event.model";
import Thread from "../models/thread.model";
import User from "../models/user.model";
import { threadId } from "worker_threads";
import { fetchUser } from "./useractions";

export async function fetchEvents(pageNumber = 1, pageSize = 100) { // page size set to 5 for now.
  connectToDB();

  // calculate number of posts to skip based on the page number size
  const skipAmount = (pageNumber - 1) * pageSize;

  // query original event posts.
  const eventsQuery = Event.find({ parentId: { $in: [null, undefined] } })
    .sort({ date: "desc" }) //could be asc or desc, decide later.
    .skip(skipAmount)
    .limit(pageSize)
    .populate({
      path: "organiser",
      model: User,
    })

  const totalEventsCount = await Event.countDocuments({
    parentId: { $in: [null, undefined] },
  }); // Get total event count

  const events = await eventsQuery.exec();

  const isNext = totalEventsCount > skipAmount + events.length;

  return { events, isNext };
}

interface Params { 
  eventName: string,
  organiserId: string,
  description: string | null,
  house: string | null,
  form: string | null,
  date: Date,
  imagePath: string,
  interestedPeople: Array<any>
}

export async function createEvent({ eventName, organiserId, description, house, form, interestedPeople, date, imagePath }: Params
) {
  try {
    connectToDB();
    let organiser = (await fetchUser(organiserId))._id;
    const createdEvent = await Event.create({
      eventName,
      organiser,
      imagePath,
      description,
      house,
      form,
      date,
      interestedPeople
    });
    

    await User.findByIdAndUpdate(organiser, {
      $push: { events: createdEvent._id },
    });

  } catch (error: any) {
    throw new Error(`Failed to create event: ${error.message}`);
  }
}

export async function deleteEvent(id: string): Promise<void> {
  try {
    connectToDB();

    const mainEvent = await Event.findById(id).populate({
        path: "organiser",
        model: User,
      })
      .populate({
        path: "event",
        model: Event,
      });

    if (!mainEvent) {
      throw new Error("Thread not found");
    }

    const uniqueOrganiserIds = new Set(
      [
        mainEvent.organiser?._id?.toString(),
      ].filter((id) => id !== undefined)
    );

    await User.updateMany(
      { _id: { $in: Array.from(uniqueOrganiserIds) } },
      { $pull: { events: mainEvent._id } }
    );

  } catch (error: any) {
    throw new Error(`Failed to delete event: ${error.message}`);
  }
}

export async function fetchEventById(eventId: string) {
  connectToDB();

  try { 
    const event = await Event.findById(eventId)
      .populate({
        path: "event",
        model: Event,
      })
      .populate({
        path: "organiser",
        model: User,
      })
      .exec();

    return event;
  } catch (err) {
    console.error("Error while fetching thread:", err);
    throw new Error("Unable to fetch thread");
  }
}

export async function markInterested(
  eventId: string,
  userId: string,
) {
  
  connectToDB()

  try {
    const eventToMark = await Event.findById(eventId)

    if (!eventToMark) {
        throw new Error("Event not found");
        
    }

    const userHasMarkedEvent = eventToMark.interestedPeople(userId)
    
    if(!eventToMark.interestedPeople){
        eventToMark.interestedPeople = [];
    }

    if(userHasMarkedEvent){
        eventToMark.interestedPeople.pop(userId)
        await eventToMark.save();
        return false;
    }
    else{
        eventToMark.interestedPeople.push(userId)
        await eventToMark.save();
        return true;
    }
    
  } catch (error: any) {
    throw new Error(`Error adding like to thread: ${error.message}`);
  }
}

export async function fetchInterestedPeople(eventId: string) {
  try{
    connectToDB();

    const event = await Event.findOne({ id: eventId})
    return event.interestedPeople as Array<any>
  } catch (error: any){
    throw new Error(`Failed to fetch event data: ${error.message}`);
  }
}