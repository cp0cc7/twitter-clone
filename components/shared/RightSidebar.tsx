import React, { useState, useEffect } from "react";
import moment from "moment";
import { fetchEvents } from "@/lib/actions/event.actions";
import Link from "next/link";
import Image from "next/image";

async function RightSidebar() {
  const result = await fetchEvents();

  const renderEvents = () => {
    return (
      <div className="community-card mt-6">
        <h2 className="head-text">Upcoming Events</h2>
        {result.events.map((event, index) => (
          <div className="user-card" key={index}>
            <p>
              {moment(event.date).format("MMMM Do, YYYY")}: {event.title}
            </p>
          </div>
        ))}
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
