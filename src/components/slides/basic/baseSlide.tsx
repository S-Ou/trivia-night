import styled from "styled-components";

const SlideWrapper = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: center;
  padding: 5rem;
`;

export default function BaseSlide({ children }: { children: React.ReactNode }) {
  return <SlideWrapper>{children}</SlideWrapper>;
}
