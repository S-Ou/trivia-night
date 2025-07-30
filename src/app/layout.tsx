import type { Metadata } from "next";
import { Theme, ThemePanel } from "@radix-ui/themes";
import StyledComponentsRegistry from "../lib/registry";
import "@radix-ui/themes/styles.css";
import "./globals.css";
import { Toaster } from "sonner";

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
        <StyledComponentsRegistry>
          <Theme>
            {children}
            <Toaster richColors position="top-right" closeButton />
            <ThemePanel />
          </Theme>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
