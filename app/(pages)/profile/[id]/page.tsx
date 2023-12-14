import Image from "next/image";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { profileTabs } from "@/constants";

import ThreadsTab from "@/components/shared/ThreadsTab";
import ProfileHeader from "@/components/shared/ProfileHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { fetchUser } from "@/lib/actions/useractions";

async function Page({ params }: { params: { id: string } }) {
  const user = await currentUser();
  if (!user) return null;

  const userInfo = await fetchUser(params.id);
  if (!userInfo?.onboarded) redirect("/completeprofile");

  // Filter out the "Posts" tab from the rendering
  const filteredTabs = profileTabs.filter((tab) => tab.label !== "Posts");

  return (
    <section>
      <ProfileHeader //added forms and house here
        accountId={userInfo.id}
        authUserId={user.id}
        name={userInfo.name}
        username={userInfo.username}
        imgUrl={userInfo.image}
        bio={userInfo.bio}
        form={userInfo.form ? userInfo.form : ""} //added for validation
        house={userInfo.house ? userInfo.house : ""}
        following={userInfo.following ? userInfo.following : []}
        followers={userInfo.followers ? userInfo.followers : []}
      />

      <div className="mt-9">
        <Tabs defaultValue="threads" className="w-full">
          <TabsList className="tab">
            {filteredTabs.map(
              (
                tab //hiding profile tab as not using it
              ) => (
                <TabsTrigger key={tab.label} value={tab.value} className="tab">
                  <Image
                    src={tab.icon}
                    alt={tab.label}
                    width={24}
                    height={24}
                    className="object-contain"
                  />
                  <p className="max-sm:hidden">{tab.label}</p>
                </TabsTrigger>
              )
            )}
          </TabsList>
          <TabsContent value="threads" className="w-full text-light-1">
            {/* Render the Posts content */}
            <ThreadsTab
              currentUserId={user.id}
              accountId={userInfo.id}
              accountType="User"
            />
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}
export default Page;
