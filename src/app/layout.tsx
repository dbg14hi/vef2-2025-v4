import type { Metadata } from "next";
import Navigation from "@/components/Navigation/Navigation";
import "./globals.css";

export const metadata: Metadata = {
  title: "Halló heimur",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <Navigation />
        <main>{children}</main>
      </body>
    </html>
  );
}
