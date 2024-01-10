//"use client";

import Image from "next/image";
import Link from "next/link";

import { formatDateString } from "@/lib/utils";
import DeleteEventButton from "../interactions/DeleteEventButton";
import LikeBlog from "../interactions/LikeBlog";
import InlineMarkInterestButton from "../interactions/InlineMarkInterestButton";
import {
  fetchEvents,
  fetchInterestedPeople,
} from "@/lib/actions/event.actions";

interface Props {
  currentUserId: string;
  eventId: string;
  event: {
    eventName: string;
  };
  organiser: {
    name: string;
    image: string;
    id: string;
  };
  imagePath: string;
  description: string;
  house: string;
  form: string;
  date: Date;
  interestedPeople: Array<any>;
}

async function EventCard({
  currentUserId,
  eventId,
  event,
  organiser,
  imagePath,
  description,
  house,
  form,
  date,
  interestedPeople,
}: Props) {
  if (!organiser || !organiser.id) {
    return null; //return null if no organiser
  }
  return (
    <article
      className={`flex w-full flex-col relative ${"mb-[-20px] z-10 border border-gray-300 rounded-md"}`}
    >
      <div className="flex items-start justify-between">
        <div className="flex w-full flex-1 flex-row gap-4">
          <div className="flex flex-col items-center">
            <Link
              href={`/profile/${organiser.id}`}
              className="relative h-11 w-11"
            >
              <Image
                src={organiser.image}
                alt="user_community_image"
                fill
                className="cursor-pointer rounded-full"
              />
            </Link>
          </div>

          <div className="flex w-full flex-col">
            <Link href={`/profile/${organiser.id}`} className="w-fit">
              <h4 className="cursor-pointer text-base-semibold text-light-1">
                {organiser.name}
              </h4>
            </Link>
            {/*this is where the inline mark interest button will be*/}
            <InlineMarkInterestButton
              currentUserId={currentUserId}
              eventId={eventId}
              eventInterestList={await fetchInterestedPeople(eventId)} //this is where the follower lists need to be injected again
            />
            <p className="mt-2 text-small-regular text-light-2">
              {description}
            </p>

            <div className=" mt-5 flex  gap-3">
              {/*add delete event button*/}
              <DeleteEventButton
                eventId={JSON.stringify(eventId)}
                currentUserId={currentUserId}
                organiserId={organiser.id}
              />
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

export default EventCard;

function logError(message: string) {
  console.log(message);
}
