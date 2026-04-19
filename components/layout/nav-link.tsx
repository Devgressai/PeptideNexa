"use client";

import Link from "next/link";
import type { Route } from "next";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

type NavLinkProps = {
  href: Route;
  label: string;
  className?: string;
};

/**
 * Primary-nav link with active state. A link is "active" when the current
 * pathname starts with the link's href (so /peptides/bpc-157 still highlights
 * the top-level /peptides link). The home link only matches exact "/".
 */
export function NavLink({ href, label, className }: NavLinkProps) {
  const pathname = usePathname();
  const isActive =
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <Link
      href={href}
      aria-current={isActive ? "page" : undefined}
      className={cn(
        "text-sm transition-colors",
        isActive ? "text-ink" : "text-ink-muted hover:text-ink",
        className,
      )}
    >
      {label}
    </Link>
  );
}
