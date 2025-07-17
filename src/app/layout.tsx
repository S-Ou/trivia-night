import type { Metadata } from "next";
import { Theme } from "@radix-ui/themes";
import StyledComponentsRegistry from "../lib/registry";
import "@radix-ui/themes/styles.css";
import "./globals.css";
import { QuestionProvider } from "@/contexts/QuestionContext";

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
          <QuestionProvider>
            <Theme>
              {children}
              {/* <ThemePanel /> */}
            </Theme>
          </QuestionProvider>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
