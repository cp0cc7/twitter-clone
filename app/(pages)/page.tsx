import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import BlogCard from "@/components/cards/BlogCard";
import Pagination from "@/components/page-parts/Pagination";

import { getBlogs } from "@/lib/actions/blog.actions";
import { fetchUser } from "@/lib/actions/useractions";

async function LandingPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  const user = await currentUser();
  if (!user) return null;

  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onboarded) redirect("/completeprofile");

  const result = await getBlogs(searchParams.page ? +searchParams.page : 1, 30);

  return (
    <>
      <div className="container">
        <h1 className="title-card">Whats Happening</h1>
      </div>
      <section className=" mt-7 flex flex-col gap-10 rounded-lg ">
        {result.posts.length === 0 ? (
          <p className="no-result">No blogs here yet</p>
        ) : (
          <>
            {result.posts.map((post) => (
              <BlogCard
                key={post._id}
                id={post._id}
                currentUserId={user.id}
                parentId={post.parentId}
                content={post.text}
                author={post.author}
                createdAt={post.createdAt}
                comments={post.children}
                likes={post.likes}
              />
            ))}
          </>
        )}
      </section>

      <Pagination
        path="/"
        pageNumber={searchParams?.page ? +searchParams.page : 1}
        isNext={result.isNext}
      />
    </>
  );
}

export default LandingPage;
