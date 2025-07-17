import { TabNav } from "@radix-ui/themes";
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
      <ChildrenWrapper>{children}</ChildrenWrapper>
    </BodyWrapper>
  );
}
