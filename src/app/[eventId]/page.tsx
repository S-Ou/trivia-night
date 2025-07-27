"use client";

import { Button } from "@radix-ui/themes";
import { PageTemplate, Page } from "./pageTemplate";
import { Presentation } from "lucide-react";

export default function Home() {
  return (
    <PageTemplate currentPage={Page.Home}>
      <a href="./present" target="_blank" rel="noopener noreferrer">
        <Button variant="solid" size={"4"}>
          <Presentation />
          Present
        </Button>
      </a>
    </PageTemplate>
  );
}
