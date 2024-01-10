//"use client";

import Image from "next/image";
import Link from "next/link";

import { formatDateString } from "@/lib/utils";
import LikeBlog from "../interactions/LikeBlog";
import InlineFollowUserButton from "../interactions/InlineFollowUserButton";
import {
  fetchUser,
  fetchUserFollowing,
  fetchUserFollowers,
} from "@/lib/actions/useractions";
import DeleteBlog from "../interactions/DeleteBlog";

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
  createdAt: string;
  comments: {
    author: {
      image: string;
    };
  }[];
  isComment?: boolean;
  likes: Array<any>;
}

async function BlogCard({
  id,
  currentUserId,
  parentId,
  content,
  author,
  createdAt,
  comments,
  isComment,
  likes,
}: Props) {
  if (!author || !author.id) {
    return null;
  }
  return (
    <article
      className={` ml-5 rounded-2xl flex w-full flex-col relative ${
        isComment ? "px-0 xs:px-7" : "bg-post-color p-7"
      } ${!isComment ? "mb-[-20px] z-10 border border-gray-300" : ""}`}
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
              <LikeBlog
                likes={likes}
                threadId={id}
                currentUserId={currentUserId}
              />

              <Link href={`/blog/${id}`}>
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
                <p className="mt-1 text-small-regular text-white">No replies</p>
              )}
              <DeleteBlog
                threadId={JSON.stringify(id)}
                currentUserId={currentUserId}
                authorId={author.id}
                parentId={parentId}
                isComment={isComment}
              />
            </div>
            <div
              className={`${isComment && "mb-10"} mt-2 absolute top-2 right-2 `}
            >
              <p className="text-small-regular text-white ">
                {formatDateString(createdAt)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

export default BlogCard;

function logError(message: string) {
  console.log(message);
}
