import { SignedIn, SignOutButton } from "@clerk/nextjs";
{
  /* allows me to manage the logout button */
}
import Image from "next/image";
{
  /* using nextjs local import feature for logos and svgs */
}
import Link from "next/link";
{
  /* Provides me with navigation betweeen routes, when I use </link> I can send the user to a different page once they click something */
}

function Topbar() {
  return (
    <nav className="topbar flex items-center justify-center">
      {" "}
      {/* This is setting the Calday logo in the center of the screen */}
      <Link href="/" className="flex items-center gap-4">
        <Image
          src="/assets/CaldayLogo.png"
          alt="caldaylogo"
          width={85}
          height={85}
        />{" "}
        <p
          className=" text-heading2-bold text-light-1 max-xs:hidden"
          style={{ marginTop: "8px", marginRight: "5px" }}
        >
          <span style={{ fontSize: "3rem" }}>Calday Blog</span>{" "}
          {/* Title of Page positioned after the logo on the right */}
        </p>
      </Link>
      <div className="flex items-center gap-1">
        <div className="block md:hidden">
          <SignedIn>
            <SignOutButton>
              <div className="flex cursor-pointer ml-11">
                <Image
                  src="/assets/logout-svgrepo-com.svg"
                  alt="logout"
                  width={40}
                  height={40}
                />
                <p className="text-light-2 max-lg:hidden margin-left-11 block md:hidden">
                  {" "}
                  {/* Hiding the logout button unless on medium devices */}
                  Logout
                </p>
              </div>
            </SignOutButton>
          </SignedIn>
        </div>
      </div>
    </nav>
  );
}

export default Topbar;
