import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs'
import Provider from "./provider";
import { Toaster } from "sonner";
import { SmoothCursor } from "@/components/ui/smooth-cursor";
import { LightRays } from "@/components/ui/light-rays";
import { Meteors } from "@/components/ui/meteors";

export const metadata: Metadata = {
  title: "NexDrew",
  description: "Build your website with AI",
};

const outfit = Outfit({subsets: ["latin"]});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
        <html lang="en" suppressHydrationWarning className="dark">
          <body
            className={outfit.className}
            suppressHydrationWarning
          >
            <Provider>
              <SmoothCursor />
              <div className="pointer-events-none fixed inset-0 -z-20 w-full h-[200vh] overflow-hidden">
                <Meteors number={40} minDuration={4} maxDuration={14} />
              </div>
              <div className="pointer-events-none fixed inset-0 -z-10 w-full h-[120vh] overflow-hidden">
                <LightRays count={12} length="100vh" />
              </div>
              {children}
              <Toaster />
            </Provider>
          </body>
        </html>
    </ClerkProvider>
  );
}
