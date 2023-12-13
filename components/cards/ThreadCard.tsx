//"use client";

import Image from "next/image";
import Link from "next/link";

import { formatDateString } from "@/lib/utils";
import DeleteThread from "../forms/DeleteThread";
import LikeThread from "../forms/LikeThread";
import InlineFollowUserButton from "../forms/InlineFollowUserButton";
import {
  fetchUser,
  fetchUserFollowing,
  fetchUserFollowers,
} from "@/lib/actions/useractions";

interface Props {
  id: string;
  currentUserId: string;
  parentId: string | null;
  content: string;
  author: {
    name: string;
    image: string;
    id: string;
  };
  community: {
    id: string;
    name: string;
    image: string;
  } | null;
  createdAt: string;
  comments: {
    author: {
      image: string;
    };
  }[];
  isComment?: boolean;
  likes: Array<any>; //this is never actually initialised anywhere, its just constantly referenced but only ever with its param type, not the actual started object
}

async function ThreadCard({
  id,
  currentUserId,
  parentId,
  content,
  author,
  community,
  createdAt,
  comments,
  isComment,
  likes,
}: Props) {
  if (!author || !author.id) {
    return null; // Return or render an appropriate fallback if author or author.id is null/undefined
  }
  return (
    <article
      className={`flex w-full flex-col relative ${
        isComment ? "px-0 xs:px-7" : "bg-post-color p-7"
      } ${
        !isComment ? "mb-[-35px] z-10 border border-gray-300" : "" // Add border styles for non-comment posts
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex w-full flex-1 flex-row gap-4">
          <div className="flex flex-col items-center">
            <Link href={`/profile/${author.id}`} className="relative h-11 w-11">
              <Image
                src={author.image}
                alt="user_community_image"
                fill
                className="cursor-pointer rounded-full"
              />
            </Link>
          </div>

          <div className="flex w-full flex-col">
            <Link href={`/profile/${author.id}`} className="w-fit">
              <h4 className="cursor-pointer text-base-semibold text-light-1">
                {author.name}
              </h4>
            </Link>
            {currentUserId !== author.id && (
              <InlineFollowUserButton
                currentUserID={currentUserId}
                targetUserID={author.id}
                targetFollowing={await fetchUserFollowing(author.id)} //this is where the follower lists need to be injected again
                targetFollowers={await fetchUserFollowers(author.id)}
              />
            )}

            <p className="mt-2 text-small-regular text-light-2">{content}</p>

            <div className=" mt-5 flex  gap-3">
              <LikeThread
                likes={likes}
                threadId={id}
                currentUserId={currentUserId}
              />

              <Link href={`/thread/${id}`}>
                <Image
                  src="/assets/message.png"
                  alt="reply"
                  width={24}
                  height={24}
                  className="cursor-pointer"
                />
              </Link>

              {comments && comments.length > 0 ? (
                <p className="mt-1 text-subtle-medium text-white">
                  {comments.length} repl{comments.length === 1 ? "y" : "ies"}
                  {!isComment && comments.length > 0 && (
                    <div className="ml-3 flex items-center float-right">
                      {comments.slice(0, 2).map((comment, index) => (
                        <Image
                          key={index}
                          src={comment.author.image}
                          alt={`user_${index}`}
                          width={18}
                          height={18}
                          className={`${
                            index !== 0 && "-ml-5"
                          } rounded-full object-cover`}
                        />
                      ))}
                    </div>
                  )}
                </p>
              ) : (
                <p className="mt-1 text-subtle-medium text-white">No replies</p>
              )}
              <DeleteThread
                threadId={JSON.stringify(id)}
                currentUserId={currentUserId}
                authorId={author.id}
                parentId={parentId}
                isComment={isComment}
              />
            </div>
            <div className={`${isComment && "mb-10"} mt-2 `}>
              <p className=" text-subtle-medium text-white ">
                {formatDateString(createdAt)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

export default ThreadCard;

function logError(message: string) {
  console.log(message);
}
