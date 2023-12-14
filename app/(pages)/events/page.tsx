"use server";
import "../../globals.css"; // Adjust the path to import the globals.css file
import { createEvent, fetchEvents } from "@/lib/actions/event.actions";
import {
  useFormField,
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  FormField,
} from "@/components/ui/form";
import { EventValidation } from "@/lib/validations/event";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { usePathname, useRouter } from "next/navigation";
import { currentUser } from "@clerk/nextjs";
import { fetchUsers } from "@/lib/actions/useractions";
import CreateEventForm from "@/components/forms/CreateEventForm";
import moment from "moment";

interface Event {
  date: Date;
  title: string;
}

async function EventsPage() {
  //userId as param - function is export default so never passed.

  const user = await currentUser();
  if (!user) return null; //this feels wrong but it made it shut up

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
      <h1 className="head-text text-left text-lg mt-9 mb-6">Events Page</h1>{" "}
      {/* title*/}
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
