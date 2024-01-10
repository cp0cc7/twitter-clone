import React, { useState, useEffect } from "react";
import moment from "moment";
import { fetchEvents } from "@/lib/actions/event.actions";
import Link from "next/link";
import Image from "next/image";
import { fetchUser } from "@/lib/actions/useractions";

async function RightSidebar() {
  const result = await fetchEvents();

  const renderEvents = () => {
    return (
      <div className="background-card mt-6">
        <h2 className="head-text">Upcoming Events</h2>
        {result.events.map(async (event, index) => {
          console.log("staged"); //this isn't printing. why?
          //this isn't returning a value for some reason. need to figure out why. potentially to do with the await, or how the ID is being passed?
          return (
            <div className="user-card" key={index}>
              <article>
                {moment(event.date).format("MMMM Do, YYYY")}:{" "}
                <b>{event.eventName}</b>
                <br />
                {event.description && (
                  <div>Description: {event.description}</div>
                )}
                {event.organiser && (
                  <div>
                    <Link href={`/profile/${event.organiser.id}`}>
                      <div className="flex flex-row">
                        Organiser:
                        <Image
                          src={event.organiser.image}
                          alt="user_profile"
                          className="rounded-full object-cover ml-2 mr-1"
                          height={24}
                          width={24}
                        />
                        <i>{event.organiser.name}</i>
                      </div>
                    </Link>
                  </div>
                )}
                {event.house && <div>House: {event.house}</div>}
                {event.form && <div>Form: {event.form}</div>}
              </article>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <section className="custom-scrollbar rightsidebar">
      {renderEvents()}
    </section>
  );
}

export default RightSidebar;
