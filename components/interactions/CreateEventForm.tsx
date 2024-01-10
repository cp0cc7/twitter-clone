"use client";
import React from "react";
import "react-calendar/dist/Calendar.css";
import "@/app/globals.css"; // Adjust the path to import the globals.css file
import { createEvent } from "@/lib/actions/event.actions";
import {
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormField,
  FormDescription,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { EventValidation } from "@/lib/validations/event";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import UserCard from "@/components/cards/UserCard";
import Image from "next/image";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";

interface Props {
  users: any[];
}

function CreateEventForm({ users }: Props) {
  const form = useForm<z.infer<typeof EventValidation>>({
    resolver: zodResolver(EventValidation),
    defaultValues: {
      eventName: "",
      organiserId: "", //organiser isn't working - probably because it needs to be a user id type, rather than hollow string. Use automatic retrieval instead? probably best.
      imagePath: "",
      description: "",
      house: "",
      form: "",
      date: new Date(),
      interestedPeople: new Array<any>(),
    },
  });

  const handleAddEvent = async (values: z.infer<typeof EventValidation>) => {
    await createEvent({
      eventName: values.eventName,
      organiserId: values.organiserId,
      imagePath: values.imagePath,
      description: values.description,
      house: values.house,
      form: values.form,
      interestedPeople: new Array<any>(),
      date: values.date,
    });
    console.log("Event '" + values.eventName + "' succesfully created.");
  }; //Event validation failed: organiser: Cast to ObjectId failed for value "{ params: {}, searchParams: {} }" (type Object) at path "organiser" because of "BSONError"

  return (
    <div>
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
            name="organiserId"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base-semibold text-light-2">
                  Organiser
                </FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="h-[60px] w-[300px]">
                      <SelectValue placeholder="Select an organiser" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="overflow-y-auto max-h-[25rem] bg-post-color ">
                    {users.map((user) => {
                      return (
                        <SelectItem
                          value={user.id}
                          className="hover:bg-slate-500"
                        >
                          <div className="user-card_avatar">
                            <div className="relative h-12 w-12">
                              <Image
                                src={user.image}
                                alt="user_logo"
                                fill
                                className="rounded-full object-cover"
                              />
                            </div>

                            <div className="flex-1 text-ellipsis">
                              <h4 className="text-base-semibold text-light-1">
                                {user.name}
                              </h4>
                              <p className="text-small-medium text-light-1">
                                @{user.username}
                              </p>
                            </div>
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem className="flex flex-col text-light-1">
                <FormLabel>Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-[240px] pl-3 text-left font-normal bg-transparent",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-auto p-0 text-light-1 bg-post-color"
                    align="start"
                  >
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => date < new Date()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
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
  );
}

export default CreateEventForm;
