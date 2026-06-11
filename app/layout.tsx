import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "OnlyCamps | MetroWest Summer Camp Discovery",
  description:
    "A discovery and planning app for elementary summer camps near Natick, Framingham, Wayland, and Sudbury.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
