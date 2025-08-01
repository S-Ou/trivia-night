import Footer from "@/components/footer";
import { TabNav, Select } from "@radix-ui/themes";
import { TableOfContents } from "lucide-react";
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

  @media (max-width: 768px) {
    display: none;
  }
`;

const MobileSelectWrapper = styled.div`
  display: none;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    display: block;
  }
`;

const ChildrenWrapper = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const SelectTrigger = styled(Select.Trigger)`
  width: 100%;
`;

const SelectTriggerContent = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

export function PageTemplate({
  tabs,
  children,
  mobileSelectOptions,
  currentValue,
  onValueChange,
}: {
  tabs: ReactNode;
  children: ReactNode;
  mobileSelectOptions?: { value: string; label: string; href: string }[];
  currentValue?: string;
  onValueChange?: (href: string) => void;
}) {
  return (
    <BodyWrapper>
      <PageTitle>Trivia Night</PageTitle>

      <TabNavRoot justify={"center"}>{tabs}</TabNavRoot>

      {mobileSelectOptions && (
        <MobileSelectWrapper>
          <Select.Root
            value={currentValue}
            onValueChange={(value) => {
              const option = mobileSelectOptions.find(
                (opt) => opt.value === value
              );
              if (option?.href && onValueChange) {
                onValueChange(option.href);
              }
            }}
          >
            <SelectTrigger variant="soft">
              <SelectTriggerContent>
                <TableOfContents size={16} />
                {currentValue}
              </SelectTriggerContent>
            </SelectTrigger>
            <Select.Content position="popper">
              {mobileSelectOptions.map((option) => (
                <Select.Item key={option.value} value={option.value}>
                  {option.label}
                </Select.Item>
              ))}
            </Select.Content>
          </Select.Root>
        </MobileSelectWrapper>
      )}

      <ChildrenWrapper>{children}</ChildrenWrapper>
      <Footer />
    </BodyWrapper>
  );
}
