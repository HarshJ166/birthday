import type { Metadata } from "next";
import { Caveat, Fraunces, Instrument_Sans } from "next/font/google";
import "./globals.css";

const displaySerif = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
  /* opsz is the whole reason to use Fraunces. next/font ships only the axes
     named here, so leaving it out served one text-size drawing for everything
     from the 15px date to the 215px name. */
  axes: ["opsz", "SOFT", "WONK"],
  display: "swap",
});

/** The letter is handwritten, so it gets an actual hand. */
const handwriting = Caveat({
  variable: "--font-hand",
  subsets: ["latin"],
  display: "swap",
});

const bodySans = Instrument_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Devyani — twenty-three",
  description:
    "A birthday page for Devyani Rawat, who turns toward the sun and keeps her eyes on the sky.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${displaySerif.variable} ${bodySans.variable} ${handwriting.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
