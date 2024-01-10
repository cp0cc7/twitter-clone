import React from "react";
import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { Lato } from "next/font/google";
import { Roboto_Mono } from "next/font/google";

import "../globals.css";
import LeftSidebar from "@/components/page-parts/LeftSidebar";
import Bottombar from "@/components/page-parts/Bottombar";
import RightSidebar from "@/components/page-parts/RightSidebar";
import Topbar from "@/components/page-parts/Topbar";

export const metadata: Metadata = {
  title: "Calday Blog",
  description: "Calday's social media platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark,
      }}
    >
      <html lang="en">
        <head>
          <link rel="stylesheet" href="../globals.css" />
        </head>
        <body className="Raleway">
          <Topbar />
          <main className="flex">
            <LeftSidebar />
            <section
              className="main-container"
              style={{ fontFamily: "Raleway, sans-serif" }}
            >
              <div className=" w-full justify-content:flex-end max-w-4xl">
                {children}
              </div>
            </section>

            <RightSidebar />
          </main>
          <Bottombar />
        </body>
      </html>
    </ClerkProvider>
  );
}
//Topbar with left and RightSidebar embedded into the interface, this ensures they stay on all pages. All of the Bars are imported from components/page-parts
