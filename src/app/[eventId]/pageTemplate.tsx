import { ReactNode } from "react";
import { PageTemplate } from "../pageTemplate";
import { TabNav } from "@radix-ui/themes";
import Link from "next/link";
import { useQuestionContext } from "@/contexts/QuestionContext";
import styled, { keyframes } from "styled-components";
import { useRouter } from "next/navigation";

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

const pulse = keyframes`
  0% {
    box-shadow: 0 0 0 0 var(--accent-9);
  }
  70% {
    box-shadow: 0 0 0 0.5rem transparent;
  }
  100% {
    box-shadow: 0 0 0 0 transparent;
  }
`;

const HighlightedTab = styled(TabNav.Link)`
  > span {
    animation: ${pulse} 2s infinite;

    &::after {
      align-items: center;
      background: var(--accent-9);
      border-radius: 50%;
      color: white;
      content: "!";
      display: flex;
      font-size: 0.8rem;
      font-weight: bold;
      height: 1rem;
      justify-content: center;
      position: absolute;
      right: -0.5rem;
      top: -0.5rem;
      width: 1rem;
    }
  }
`;

export function EventPageTemplate({
  currentPage,
  children,
}: {
  currentPage: Page;
  children: ReactNode;
}) {
  const router = useRouter();
  const { questions } = useQuestionContext();
  const shouldHighlightQuestions =
    questions.length === 0 && currentPage !== Page.Questions;

  const getHref = (targetPage: Page) =>
    currentPage === targetPage
      ? "#"
      : currentPage != Page.Home
      ? `../${pageRoutes[targetPage]}`
      : `./${pageRoutes[targetPage]}`;

  const QuestionsTabComponent = shouldHighlightQuestions
    ? HighlightedTab
    : TabNav.Link;

  const mobileSelectOptions = [
    { value: Page.Home, label: Page.Home, href: getHref(Page.Home) },
    { value: Page.Config, label: Page.Config, href: getHref(Page.Config) },
    {
      value: Page.Questions,
      label: Page.Questions,
      href: getHref(Page.Questions),
    },
    { value: Page.Answers, label: Page.Answers, href: getHref(Page.Answers) },
    { value: Page.Results, label: Page.Results, href: getHref(Page.Results) },
  ];

  const handleMobileNavigation = (href: string) => {
    if (href !== "#") {
      router.push(href);
    }
  };

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
          <QuestionsTabComponent
            asChild
            active={currentPage === Page.Questions}
          >
            <Link href={getHref(Page.Questions)}>{Page.Questions}</Link>
          </QuestionsTabComponent>
          <TabNav.Link asChild active={currentPage === Page.Answers}>
            <Link href={getHref(Page.Answers)}>{Page.Answers}</Link>
          </TabNav.Link>
          <TabNav.Link asChild active={currentPage === Page.Results}>
            <Link href={getHref(Page.Results)}>{Page.Results}</Link>
          </TabNav.Link>
        </>
      }
      mobileSelectOptions={mobileSelectOptions}
      currentValue={currentPage}
      onValueChange={handleMobileNavigation}
    >
      {children}
    </PageTemplate>
  );
}
