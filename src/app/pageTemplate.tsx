import Footer from "@/components/footer";
import { TabNav } from "@radix-ui/themes";
import { ReactNode } from "react";
import styled from "styled-components";

const BodyWrapper = styled.div`
  margin: auto;
  max-width: 800px;
  padding-block: 2rem;
  padding-inline: 1rem;
`;

const PageTitle = styled.h1`
  font-size: 3rem;
  font-stretch: expanded;
  font-weight: 800;
  margin-bottom: 1rem;
  text-align: center;
`;

const TabNavRoot = styled(TabNav.Root)`
  margin-bottom: 2rem;
  overflow: visible;
`;

const ChildrenWrapper = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export function PageTemplate({
  tabs,
  children,
}: {
  tabs: ReactNode;
  children: ReactNode;
}) {
  return (
    <BodyWrapper>
      <PageTitle>Trivia Night</PageTitle>
      <TabNavRoot justify={"center"}>{tabs}</TabNavRoot>
      <ChildrenWrapper>{children}</ChildrenWrapper>
      <Footer />
    </BodyWrapper>
  );
}
