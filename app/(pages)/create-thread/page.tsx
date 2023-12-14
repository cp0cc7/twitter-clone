import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import PostThread from "@/components/forms/PostThread";
import { fetchUser } from "@/lib/actions/useractions";

async function Page() {
  const user = await currentUser(); //getting user info
  if (!user) return null;

  // fetch organization list created by user
  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onboarded) redirect("/completeprofile");

  return (
    <>
      <h1 className="head-text">Share your thoughts</h1>

      <PostThread userId={userInfo._id} />
    </>
  );
}

export default Page;
