import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-sm border px-2 py-0.5 text-[11px] font-medium uppercase tracking-[0.08em]",
  {
    variants: {
      variant: {
        default: "border-line bg-paper-raised text-ink-strong",
        brand: "border-brand/25 bg-brand-soft text-brand-deep",
        signal: "border-signal/30 bg-signal-soft text-signal",
        accent: "border-accent/30 bg-accent-soft text-ink-strong",
        muted: "border-transparent bg-paper-sunken text-ink-muted",
        success: "border-success/30 bg-success/10 text-success",
        danger: "border-danger/30 bg-danger/10 text-danger",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}
