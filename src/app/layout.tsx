import type { Metadata } from "next";
import "@radix-ui/themes/styles.css";
import "./globals.css";
import { Theme, ThemePanel } from "@radix-ui/themes";

export const metadata: Metadata = {
  title: "Trivia Night",
  description: "Trivia",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Theme>
          {children}
          <ThemePanel />
        </Theme>
      </body>
    </html>
  );
}
