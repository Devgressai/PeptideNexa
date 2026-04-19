import * as React from "react";
import { Container } from "./container";
import { cn } from "@/lib/utils";

type EditorialLayoutProps = {
  children: React.ReactNode;
  aside?: React.ReactNode;
  className?: string;
};

// Two-column editorial layout: narrow reading column on the left, sticky
// contextual rail on the right. On mobile, aside collapses below the article.
export function EditorialLayout({ children, aside, className }: EditorialLayoutProps) {
  return (
    <Container className={cn("py-10 md:py-14", className)}>
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-16">
        <article className="prose-editorial max-w-prose">{children}</article>
        {aside ? (
          <aside className="hidden lg:block">
            <div className="sticky top-24 flex flex-col gap-6">{aside}</div>
          </aside>
        ) : null}
      </div>
    </Container>
  );
}
