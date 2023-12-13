import Link from "next/link";
import Image from "next/image";
import FollowUserButton from "../forms/FollowUserButton";

interface Props {
  accountId: string;
  authUserId: string;
  name: string;
  username: string;
  imgUrl: string;
  bio: string;
  house: string;
  form: string;
  type?: string;
  following: Array<any>;
  followers: Array<any>;
}

const ProfileHeader = ({
  accountId,
  authUserId,
  name,
  username,
  imgUrl,
  bio,
  house,
  form,
  type,
  following,
  followers,
}: Props) => {
  return (
    <div className="flex w-full flex-col justify-start">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative h-20 w-20 object-cover">
            <Image
              src={imgUrl}
              alt="logo"
              fill
              className="rounded-full object-cover shadow-2xl"
            />
          </div>

          <div className="flex-1">
            <h2 className="text-left text-heading3-bold text-light-1">
              {name}
            </h2>
            <p className="text-base-medium text-white">@{username}</p>
          </div>
        </div>
        {accountId === authUserId && type !== "Community" && (
          <Link href="/profile/edit">
            <div className="flex cursor-pointer gap-3 rounded-lg bg-post-color px-4 py-2">
              <Image
                src="/assets/edit.svg"
                alt="logout"
                width={20}
                height={20}
              />

              <p className="text-white max-sm:hidden">Edit</p>
            </div>
          </Link>
        )}
        {accountId !== authUserId && type !== "Community" && (
          <div className="flex cursor-pointer gap-3 rounded-lg bg-white px-4 py-2">
            <FollowUserButton
              currentUserID={authUserId}
              targetUserID={accountId}
              targetFollowing={following}
              targetFollowers={followers}
            />
          </div>
        )}
      </div>
      <p className="mt-6 max-w-lg text-base-regular text-light-2">{house}</p>{" "}
      {/*house and form display*/}
      <p className="mt-6 max-w-lg text-base-regular text-light-2">{form}</p>
      <p className="mt-6 max-w-lg text-base-regular text-light-2">{bio}</p>
      <div className="mt-12 h-0.5 w-full bg-white" />
    </div>
  );
};

export default ProfileHeader;
