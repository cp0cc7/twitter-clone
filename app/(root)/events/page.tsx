"use client";
import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import moment from "moment";
import "../../globals.css"; // Adjust the path to import the globals.css file
import { createEvent } from "@/lib/actions/event.actions";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { EventValidation } from "@/lib/validations/event";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { usePathname, useRouter } from "next/navigation";

interface Event {
  date: Date;
  title: string;
}

function EventsPage(userId: string) {
  const router = useRouter();
  const pathname = usePathname();
  const [date, setDate] = useState<Date>(new Date());
  const [events, setEvents] = useState<Event[]>([]);
  const [inputValue, setInputValue] = useState<string>("");

  const handleDateChange = (date: Date) => {
    setDate(date);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleAddEvent = async (values: z.infer<typeof EventValidation>) => {
    await createEvent({
      eventName: values.eventName, //not recognised - why?
      organiser: userId,
      imagePath: values.imagePath,
      description: values.description,
      house: values.house,
      form: values.form,
      interestedPeople: new Array<any>(),
      date: date,
      path: pathname,
    });
  }; //Event validation failed: organiser: Cast to ObjectId failed for value "{ params: {}, searchParams: {} }" (type Object) at path "organiser" because of "BSONError"

  const form = useForm<z.infer<typeof EventValidation>>({
    resolver: zodResolver(EventValidation),
    defaultValues: {
      eventName: "",
      organiser: "", //organiser isn't working - probably because it needs to be a user id type, rather than hollow string. Use automatic retrieval instead? probably best.
      imagePath: "",
      description: "",
      house: "",
      form: "",
      date: new Date(),
      interestedPeople: new Array<any>(),
    },
  });

  return (
    <>
      <h1 className="head-text text-left text-lg mt-9 mb-6">Events Page</h1>{" "}
      {/* title*/}
      <div className="flex items-start">
        <div className="mr-4 custom-calendar-container">
          <Calendar
            onChange={handleDateChange}
            value={date}
            className="custom-calendar"
          />
        </div>
        <div className="flex flex-col justify-start w-full">
          <div className="">
            <Form {...form}>
              <form
                className="mt-10 flex flex-col justify-start gap-10"
                onSubmit={form.handleSubmit(handleAddEvent)}
              >
                <FormField
                  control={form.control}
                  name="eventName"
                  render={({ field }) => (
                    <FormItem className="flex w-full flex-col gap-3">
                      <FormLabel className="text-base-semibold text-light-2">
                        Event Name
                      </FormLabel>
                      <FormControl className="no-focus border border-white bg-main-color text-light-1">
                        <Textarea rows={1} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem className="flex w-full flex-col gap-3">
                      <FormLabel className="text-base-semibold text-light-2">
                        Event Description
                      </FormLabel>
                      <FormControl className="no-focus border border-white bg-main-color text-light-1">
                        <Textarea rows={5} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="organiser"
                  render={({ field }) => (
                    <FormItem className="flex w-full flex-col gap-3">
                      <FormLabel className="text-base-semibold text-light-2">
                        Organiser
                      </FormLabel>
                      <FormControl className="no-focus border border-white bg-main-color text-light-1">
                        <Textarea rows={1} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="imagePath"
                  render={({ field }) => (
                    <FormItem className="flex w-full flex-col gap-3">
                      <FormLabel className="text-base-semibold text-light-2">
                        Image Path
                      </FormLabel>
                      <FormControl className="no-focus border border-white bg-main-color text-light-1">
                        <Textarea rows={1} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="house"
                  render={({ field }) => (
                    <FormItem className="flex w-full flex-col gap-3">
                      <FormLabel className="text-base-semibold text-light-2">
                        House
                      </FormLabel>
                      <FormControl className="no-focus border border-white bg-main-color text-light-1">
                        <Textarea rows={1} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="form"
                  render={({ field }) => (
                    <FormItem className="flex w-full flex-col gap-3">
                      <FormLabel className="text-base-semibold text-light-2">
                        Form
                      </FormLabel>
                      <FormControl className="no-focus border border-white bg-main-color text-light-1">
                        <Textarea rows={1} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="bg-post-color">
                  Create Event
                </Button>
              </form>
            </Form>
          </div>
          <div className="community-card mt-6">
            <h2 className="head-text">Upcoming Events</h2>
            {events.map((event, index) => {
              return (
                <div className="user-card" key={index}>
                  <p>
                    {moment(event.date).format("MMMM Do, YYYY")}: {event.title}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}

export default EventsPage;
