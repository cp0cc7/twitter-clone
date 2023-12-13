"use client";
import { followUser } from "@/lib/actions/useractions";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { boolean } from "zod";

const FollowUserButton = ({
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
          id={"FollowUserImage"}
          onClick={async () => {
            const followJustified = await followUser(
              currentUserID,
              targetUserID
            );
            if (followJustified) {
              document
                .getElementById("FollowUserImage")
                ?.setAttribute("src", "/assets/following-user.svg");
            } else {
              document
                .getElementById("FollowUserImage")
                ?.setAttribute("src", "/assets/follow-user.svg");
            }
            currentUserFollowingTargetUser = !currentUserFollowingTargetUser;
            reloadTextContainer(
              targetFollowing.includes(currentUserID),
              currentUserFollowingTargetUser
            );
          }}
          src={
            currentUserFollowingTargetUser
              ? "/assets/following-user.svg"
              : "/assets/follow-user.svg"
          }
          alt="followuserfromdelegate"
          width={24}
          height={24}
          className="cursor-pointer object-contain bg-post-color"
        />
      }
      <p
        id="followingStatus"
        className="mt-1 ml-35 text-subtle-medium text-white bg-post-color"
      >
        {targetFollowing.includes(currentUserID) &&
        !currentUserFollowingTargetUser
          ? "Follows you"
          : targetFollowers.includes(currentUserID) &&
            targetFollowing.includes(targetUserID)
          ? "Following each other"
          : currentUserFollowingTargetUser &&
            !targetFollowing.includes(currentUserID)
          ? "Following"
          : "Not Friends :("}
      </p>
    </>
  );
};

function reloadTextContainer(
  beingFollowed: boolean,
  followingThemNow: boolean
) {
  console.log("updating");
  var container = document.getElementById("followingStatus");
  if (container) {
    container.innerHTML =
      beingFollowed && !followingThemNow
        ? "Follows you"
        : beingFollowed && followingThemNow
        ? "Following each other"
        : followingThemNow && !beingFollowed
        ? "Following"
        : "Not Friends :(";
  } else {
    return null;
  }
}

export default FollowUserButton;
