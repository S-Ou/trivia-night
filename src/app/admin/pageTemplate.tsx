import { TabNav } from "@radix-ui/themes";
import styled from "styled-components";

const BodyWrapper = styled.div`
  max-width: 800px;
  margin: auto;
  padding-inline: 1rem;
  padding-block: 2rem;
`;

const PageTitle = styled.h1`
  text-align: center;
  margin-bottom: 1rem;
  font-size: 3rem;
`;

const TabNavRoot = styled(TabNav.Root)`
  margin-bottom: 2rem;
`;

export enum Page {
  Config = "Config",
  Questions = "Questions",
  Answers = "Answers",
  Results = "Results",
}

const pageRoutes: Record<Page, string> = {
  [Page.Config]: "config",
  [Page.Questions]: "questions",
  [Page.Answers]: "answers",
  [Page.Results]: "results",
};

export function AdminPage({
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
      <PageTitle>Admin Page</PageTitle>
      <TabNavRoot justify={"center"}>
        <TabNav.Link
          href={getHref(Page.Config)}
          active={currentPage === Page.Config}
        >
          Config
        </TabNav.Link>
        <TabNav.Link
          href={getHref(Page.Questions)}
          active={currentPage === Page.Questions}
        >
          Questions
        </TabNav.Link>
        <TabNav.Link
          href={getHref(Page.Answers)}
          active={currentPage === Page.Answers}
        >
          Answers
        </TabNav.Link>
        <TabNav.Link
          href={getHref(Page.Results)}
          active={currentPage === Page.Results}
        >
          Results
        </TabNav.Link>
      </TabNavRoot>
      {children}
    </BodyWrapper>
  );
}
