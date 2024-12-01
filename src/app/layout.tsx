import type { Metadata } from "next";
import { Public_Sans } from "next/font/google";
import "./globals.css";
import Providers from "@/providers";
import { ModeToggle } from "@/components/mode-toggle";

const publicSans = Public_Sans({
  subsets: ["latin"],
  variable: "--font-public-sans",
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "PaybackPal",
  description: "A simple tool to help you manage your debtors.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={publicSans.className}>
        <Providers>
          <div className="flex justify-end p-4">
            <ModeToggle />
          </div>
          {children}
        </Providers>
      </body>
    </html>
  );
}
