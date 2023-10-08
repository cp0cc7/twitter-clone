"use client";
import { followUser } from "@/lib/actions/useractions";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { boolean } from "zod";

const InlineFollowUserButton = ({
  currentUserID,
  targetUserID,
  targetFollowing,
  targetFollowers,
}: {
  currentUserID: string;
  targetUserID: string;
  targetFollowing: Array<any>;
  targetFollowers: Array<any>;
}) => {
  const pathname = usePathname();
  var currentUserFollowingTargetUser = false;
  if (targetFollowers) {
    currentUserFollowingTargetUser = targetFollowers.includes(currentUserID);
  }

  return (
    <>
      {
        <Image
          id={"InlineFollowUserImage"}
          onClick={async () => {
            const followJustified = await followUser(
              currentUserID,
              targetUserID
            );
            if (followJustified) {
              document
                .getElementById("InlineFollowUserImage")
                ?.setAttribute("src", "/assets/following-user.svg");
            } else {
              document
                .getElementById("InlineFollowUserImage")
                ?.setAttribute("src", "/assets/follow-user.svg");
            }
          }}
          src={
            currentUserFollowingTargetUser
              ? "/assets/following-user.svg"
              : "/assets/follow-user.svg"
          }
          alt="inline_followuserfromdelegate"
          width={24}
          height={24}
          className="cursor-pointer object-contain"
        />
      }
    </>
  );
};

export default InlineFollowUserButton;
