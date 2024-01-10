import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import PostBlog from "@/components/interactions/PostBlog";
import { fetchUser } from "@/lib/actions/useractions";

async function Page() {
  const user = await currentUser(); //getting user info
  if (!user) return null;

  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onboarded) redirect("/completeprofile");

  return (
    <>
      <div className="container">
        <h1 className="title-card">Share your thoughts</h1>
      </div>

      <PostBlog userId={userInfo._id} />
    </>
  );
}

export default Page;
