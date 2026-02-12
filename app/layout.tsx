import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import NextTopLoader from "nextjs-toploader"; // Import the loader
import { ProfileProvider } from "@/context/ProfileContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Skillgroo",
  description: "Australia's number one skill platform",
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // suppressHydrationWarning is necessary because next-themes 
    // updates this element
    <html lang="en" suppressHydrationWarning> 
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NextTopLoader
          color="var(--primary)"
          initialPosition={0.08}
          crawlSpeed={200}
          height={3}
          showSpinner={false}
          shadow="0 0 10px var(--primary),0 0 5px var(--primary)"
        />

        <Providers>
          <ProfileProvider>{children}</ProfileProvider>
        </Providers>
      </body>
    </html>
  );
}