import { ReactNode } from "react";
import { PageTemplate } from "../pageTemplate";
import { TabNav } from "@radix-ui/themes";
import Link from "next/link";

export enum Page {
  Home = "Home",
  Config = "Config",
  Questions = "Questions",
  Answers = "Answers",
  Results = "Results",
}

const pageRoutes: Record<Page, string> = {
  [Page.Home]: "",
  [Page.Config]: "config",
  [Page.Questions]: "questions",
  [Page.Answers]: "answers",
  [Page.Results]: "results",
};

export function EventPageTemplate({
  currentPage,
  children,
}: {
  currentPage: Page;
  children: ReactNode;
}) {
  const getHref = (targetPage: Page) =>
    currentPage === targetPage
      ? "#"
      : currentPage != Page.Home
      ? `../${pageRoutes[targetPage]}`
      : `./${pageRoutes[targetPage]}`;

  return (
    <PageTemplate
      tabs={
        <>
          <TabNav.Link asChild active={currentPage === Page.Home}>
            <Link href={getHref(Page.Home)}>{Page.Home}</Link>
          </TabNav.Link>
          <TabNav.Link asChild active={currentPage === Page.Config}>
            <Link href={getHref(Page.Config)}>{Page.Config}</Link>
          </TabNav.Link>
          <TabNav.Link asChild active={currentPage === Page.Questions}>
            <Link href={getHref(Page.Questions)}>{Page.Questions}</Link>
          </TabNav.Link>
          <TabNav.Link asChild active={currentPage === Page.Answers}>
            <Link href={getHref(Page.Answers)}>{Page.Answers}</Link>
          </TabNav.Link>
          <TabNav.Link asChild active={currentPage === Page.Results}>
            <Link href={getHref(Page.Results)}>{Page.Results}</Link>
          </TabNav.Link>
        </>
      }
    >
      {children}
    </PageTemplate>
  );
}
