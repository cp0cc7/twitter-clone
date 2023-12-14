import React from "react";
import type { Metadata } from "next";
import { Roboto_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";

import "../globals.css";

const roboto = Roboto_Mono({ subsets: ["latin"] }); //importing font

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
    <ClerkProvider //allows you to use all of clerk's functionality within my webpage
      appearance={{
        baseTheme: dark,
      }}
    >
      <html lang="en">
        <body className={`${roboto.className} bg-main-color`}>{children}</body>{" "}
      </html>
    </ClerkProvider>
  );
}
