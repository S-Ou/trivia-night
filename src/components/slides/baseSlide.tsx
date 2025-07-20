import styled from "styled-components";

const SlideWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 5rem;
`;

export default function BaseSlide({ children }: { children: React.ReactNode }) {
  return <SlideWrapper>{children}</SlideWrapper>;
}
