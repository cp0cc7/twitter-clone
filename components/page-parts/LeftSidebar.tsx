"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { SignOutButton, SignedIn, useAuth } from "@clerk/nextjs";
import { sidebarLinks } from "@/constants";

const LeftSidebar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { userId } = useAuth();

  return (
    <section className="custom-scrollbar leftsidebar">
      <div className="padding-10 w-full gap-8 px-1 flex flex-col ">
        {sidebarLinks.map((link) => {
          let linkClasses = "leftsidebar_link";

          if (
            (pathname.includes(link.route) && link.route.length > 1) ||
            pathname === link.route
          ) {
            linkClasses += " bg-container-color";
          }

          if (link.route === "/profile") {
            link.route = `${link.route}/${userId}`;
          }

          return (
            <Link href={link.route} key={link.label} className={linkClasses}>
              <Image
                src={link.imgURL}
                alt={link.label}
                width={40}
                height={40}
              />
              <p className="text-light-1 max-lg:hidden text-lg mt-3">
                {link.label}
              </p>
            </Link>
          );
        })}
      </div>
      <div className="px-2 mt-5 ">
        <SignedIn>
          <SignOutButton signOutCallback={() => router.push("/sign-in")}>
            <div className="flex cursor-pointer gap-4 p-4">
              <Image
                src="/assets/logout-svgrepo-com.svg"
                alt="logout"
                width={40}
                height={40}
              />
              <p className="text-light-2 max-lg:hidden text-lg mt-3"></p>
            </div>
          </SignOutButton>
        </SignedIn>
      </div>
    </section>
  );
};

export default LeftSidebar;
