"use server";
import "../../globals.css";
import { createEvent, fetchEvents } from "@/lib/actions/event.actions";
import { currentUser } from "@clerk/nextjs";
import { fetchUsers } from "@/lib/actions/useractions";
import CreateEventForm from "@/components/interactions/CreateEventForm";
import moment from "moment";

interface Event {
  date: Date;
  title: string;
}

async function EventsPage() {
  const user = await currentUser();
  if (!user) return null; //this feels wrong but it made it stop

  const events = await fetchEvents();

  const users = await fetchUsers({
    userId: user.id,
    searchString: "",
    pageNumber: 1,
    pageSize: 20,
    sortBy: "desc",
  });

  return (
    <>
      <div className="container">
        <h1 className="title-card">Events</h1>
      </div>
      <div className="flex items-start">
        <div className="flex flex-col justify-start w-full">
          <div className="">
            <CreateEventForm users={users.users} />
          </div>
        </div>
      </div>
    </>
  );
}

export default EventsPage;
