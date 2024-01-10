"use client";
import { markInterested } from "@/lib/actions/event.actions";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { boolean } from "zod";

const InlineMarkInterestButton = ({
  currentUserId,
  eventId,
  eventInterestList,
}: {
  currentUserId: string;
  eventId: string;
  eventInterestList: Array<any>;
}) => {
  const pathname = usePathname();
  var currentUserFollowingTargetUser = false;
  if (eventInterestList) {
    currentUserFollowingTargetUser = eventInterestList.includes(currentUserId);
  }

  return (
    <>
      {
        <Image
          id={"InlineMarkInterestImage"}
          onClick={async () => {
            const markInterestJustified = await markInterested(
              eventId,
              currentUserId
            );
            if (markInterestJustified) {
              document
                .getElementById("InlineMarkInterestImage")
                ?.setAttribute("src", "/assets/bell-alerted.svg");
            } else {
              document
                .getElementById("InlineMarkInterestImage")
                ?.setAttribute("src", "/assets/bell.svg");
            }
          }}
          src={
            currentUserFollowingTargetUser
              ? "/assets/bell-alerted.svg"
              : "/assets/bell.svg"
          }
          alt="inline_markinterestfromdelegate"
          width={24}
          height={24}
          className="cursor-pointer object-contain"
        />
      }
    </>
  );
};

export default InlineMarkInterestButton;
