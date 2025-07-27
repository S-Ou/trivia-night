"use client";

import { Link, TabNav } from "@radix-ui/themes";
import { PageTemplate } from "./pageTemplate";

export default function HomePage() {
  return (
    <PageTemplate
      tabs={
        <TabNav.Link asChild active>
          <Link href="#">Home</Link>
        </TabNav.Link>
      }
    >
      hi
    </PageTemplate>
  );
}
