"use client";

import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";

import { deleteEvent } from "@/lib/actions/event.actions";

interface Props {
  eventId: string;
  currentUserId: string;
  organiserId: string;
}

function DeleteEventButton({ eventId, currentUserId, organiserId }: Props) {
  const pathname = usePathname();

  if (currentUserId !== organiserId || pathname === "/") return null;

  return (
    <Image
      src="/assets/calendar-cancel.svg"
      alt="remove_event"
      width={18}
      height={18}
      className="cursor-pointer object-contain"
      onClick={async () => {
        await deleteEvent(JSON.parse(eventId), pathname);
      }}
    />
  );
}

export default DeleteEventButton;
