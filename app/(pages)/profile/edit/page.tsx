import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import AccountProfile from "@/components/forms/AccountProfile";
import { fetchUser } from "@/lib/actions/useractions";

// Same code as Get started page only updated text at the bottom

async function Page() {
  const user = await currentUser();
  if (!user) return null;

  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onboarded) redirect("/completeprofile");

  const userData = {
    id: user.id,
    objectId: userInfo?._id,
    username: userInfo ? userInfo?.username : user.username,
    name: userInfo ? userInfo?.name : user.firstName ?? "",
    bio: userInfo ? userInfo?.bio : "",
    house: userInfo ? userInfo?.house : "",
    form: userInfo ? userInfo?.form : "",

    image: userInfo ? userInfo?.image : user.imageUrl,
  };

  return (
    <main className="mx-auto flex w-full flex-col justify-start px-10 py-20">
      <h1 className="head-text">Update Profile</h1>

      <section className="white flex justify-center items-center">
        <AccountProfile user={userData} btnTitle="Finish Updating profile" />
      </section>
    </main>
  );
}

export default Page;
