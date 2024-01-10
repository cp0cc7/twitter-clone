import { redirect } from "next/navigation";

import { fetchUserThreads } from "@/lib/actions/useractions";

import BlogCard from "../cards/BlogCard";
import { fetchUserPosts } from "@/lib/actions/useractions";

interface Result {
  //ThreadsTab is for the user threads page, like when you look at someone's user account.
  name: string;
  image: string;
  id: string;
  threads: {
    _id: string;
    text: string;
    parentId: string | null;
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
    children: {
      author: {
        image: string;
      };
    }[];
    likes: Array<any>; //I think the likes might have to be evaluated at this? like the topmost level? idk how this would help the homepage tho...
  }[];
}

interface Props {
  currentUserId: string;
  accountId: string;
  accountType: string;
  community: string;
}

const ThreadsTab = async ({ currentUserId, accountId, accountType }: Props) => {
  let result = await fetchUserThreads(accountId);

  if (!result) redirect("/");

  return (
    <section className="className='mt-9 flex flex-col gap-10">
      {result.threads.map((thread: any) => {
        return (
          <BlogCard
            key={thread._id}
            id={thread._id}
            currentUserId={currentUserId}
            parentId={thread.parentId}
            content={thread.text}
            author={
              accountType === "User"
                ? { name: result.name, image: result.image, id: result.id }
                : {
                    name: thread.author.name,
                    image: thread.author.image,
                    id: thread.author.id,
                  }
            }
            createdAt={thread.createdAt}
            comments={thread.children}
            likes={thread.likes}
          />
        );
      })}
    </section>
  );
};

export default ThreadsTab;
