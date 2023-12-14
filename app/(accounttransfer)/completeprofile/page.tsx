import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import AccountProfile from "@/components/forms/AccountProfile";
import { fetchUser } from "@/lib/actions/useractions";

async function Page() {
  const user = await currentUser(); //taking current user from clerk
  if (!user) return null; // to avoid typescript warnings

  const userInfo = await fetchUser(user.id);
  if (userInfo?.onboarded) redirect("/"); //if the user has made an account then they are sent to the home page

  //user data from mongodb
  const userData = {
    id: user.id,
    objectId: userInfo?._id,
    username: userInfo ? userInfo?.username : user.username,
    name: userInfo ? userInfo?.name : user.firstName ?? "",
    bio: userInfo ? userInfo?.bio : "",
    house: userInfo ? userInfo.house : "",
    form: userInfo ? userInfo.form : "",
    image: userInfo ? userInfo?.image : user.imageUrl,
    following: userInfo ? userInfo.following : new Array<any>(),
    followers: userInfo ? userInfo.followers : new Array<any>(),
  };

  return (
    //styles for the Get started page
    <main className="justify-start mx-auto items-center flex max-w-3xl flex-col ">
      <h1 className="head-text">Get Started</h1>
      <p className="mt-5 text-lg text-light-2">
        Fill out you profile to use Calday Blog.
      </p>

      <section className="mt-9 bg-main-color p-10">
        <AccountProfile user={userData} btnTitle="Enter Calday Blog" />{" "}
        {/* Account profile form is added here as I use the same form to edit profile later on*/}
      </section>
    </main>
  );
}

export default Page;
