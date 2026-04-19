import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
  {
    variants: {
      variant: {
        default: "border-line bg-paper-raised text-ink",
        brand: "border-brand/20 bg-brand/10 text-brand",
        signal: "border-signal/30 bg-signal/10 text-signal",
        muted: "border-transparent bg-paper-sunken text-ink-muted",
        success: "border-success/30 bg-success/10 text-success",
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
