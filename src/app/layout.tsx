import type { Metadata } from "next";
import { Theme } from "@radix-ui/themes";
import StyledComponentsRegistry from "../lib/registry";
import "@radix-ui/themes/styles.css";
import "./globals.css";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "Trivia Night",
  description: "Make trivia night hosting easy!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <StyledComponentsRegistry>
          <Theme>
            {children}
            <Toaster richColors position="top-right" closeButton />
          </Theme>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
