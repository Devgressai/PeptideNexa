import Link from "next/link";
import type { Route } from "next";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export type BreadcrumbCrumb = { label: string; href?: Route };

type BreadcrumbsProps = {
  items: BreadcrumbCrumb[];
  className?: string;
};

export function Breadcrumbs({ items, className }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className={cn("text-xs text-ink-subtle", className)}>
      <ol className="flex flex-wrap items-center gap-1">
        {items.map((crumb, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={`${crumb.label}-${index}`} className="flex items-center gap-1">
              {crumb.href && !isLast ? (
                <Link href={crumb.href} className="transition-colors hover:text-ink">
                  {crumb.label}
                </Link>
              ) : (
                <span
                  aria-current={isLast ? "page" : undefined}
                  className={cn(isLast && "text-ink")}
                >
                  {crumb.label}
                </span>
              )}
              {!isLast ? <ChevronRight aria-hidden className="h-3 w-3" /> : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
