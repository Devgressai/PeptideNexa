import * as React from "react";
import { Container } from "./container";
import { cn } from "@/lib/utils";

type EditorialLayoutProps = {
  children: React.ReactNode;
  aside?: React.ReactNode;
  className?: string;
};

// Two-column editorial layout. On desktop: narrow reading column + sticky
// contextual rail. On mobile: aside stacks *below* the article — trust cards
// still render, they just appear after the body so they don't push the lede.
export function EditorialLayout({ children, aside, className }: EditorialLayoutProps) {
  return (
    <Container className={cn("py-10 md:py-14", className)}>
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-16">
        <article className="prose-editorial max-w-prose">{children}</article>
        {aside ? (
          <aside className="order-last lg:order-none">
            <div className="flex flex-col gap-6 lg:sticky lg:top-24">{aside}</div>
          </aside>
        ) : null}
      </div>
    </Container>
  );
}
