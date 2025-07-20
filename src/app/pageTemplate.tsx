import { TabNav } from "@radix-ui/themes";
import Link from "next/link";
import styled from "styled-components";

const BodyWrapper = styled.div`
  margin: auto;
  max-width: 800px;
  padding-block: 2rem;
  padding-inline: 1rem;
`;

const PageTitle = styled.h1`
  font-size: 3rem;
  font-weight: 800;
  margin-bottom: 1rem;
  text-align: center;
`;

const TabNavRoot = styled(TabNav.Root)`
  margin-bottom: 2rem;
`;

const ChildrenWrapper = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

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

export function PageTemplate({
  currentPage,
  children,
}: {
  currentPage: Page;
  children: React.ReactNode;
}) {
  const getHref = (targetPage: Page) =>
    currentPage === targetPage ? "#" : `../${pageRoutes[targetPage]}`;

  return (
    <BodyWrapper>
      <PageTitle>Trivia Night</PageTitle>
      <TabNavRoot justify={"center"}>
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
      </TabNavRoot>
      <ChildrenWrapper>{children}</ChildrenWrapper>
    </BodyWrapper>
  );
}
