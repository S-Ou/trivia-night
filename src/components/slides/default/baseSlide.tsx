import styled from "styled-components";

const SlideWrapper = styled.div`
  align-items: center;
  background-color: var(--slide-bg-color);
  color: var(--slide-fg-color);
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: start;
  min-height: 100vh;
  padding: 5rem;
`;

export default function BaseSlide({ children }: { children: React.ReactNode }) {
  return <SlideWrapper>{children}</SlideWrapper>;
}
