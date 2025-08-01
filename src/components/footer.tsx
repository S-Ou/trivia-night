import { Separator } from "@radix-ui/themes";
import styled from "styled-components";

const FooterWrapper = styled.footer`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  justify-content: center;
  margin-top: 2rem;
`;

const StyledFooter = styled.footer`
  display: flex;
  font-size: 0.8rem;
  font-weight: 300;
  gap: 3rem;
  justify-content: center;
  letter-spacing: 0.02em;
  opacity: 0.7;

  a {
    text-align: center;
    text-wrap: balance;

    &:hover {
      text-decoration: underline;
    }
  }
`;

export default function Footer() {
  return (
    <FooterWrapper>
      <Separator size="4" />
      <StyledFooter>
        <a
          href="https://github.com/S-Ou"
          target="_blank"
          rel="noopener noreferrer"
        >
          Built by S-Ou
        </a>
        <a
          href="https://github.com/S-Ou/trivia-night"
          target="_blank"
          rel="noopener noreferrer"
        >
          Open-source on GitHub
        </a>
        <span>All rights reserved</span>
      </StyledFooter>
    </FooterWrapper>
  );
}
