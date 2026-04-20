import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const textareaVariants = cva(
  [
    "flex w-full rounded-md border bg-paper-raised px-3 py-2.5 text-sm text-ink",
    "placeholder:text-ink-subtle",
    "transition-colors duration-sm",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:ring-offset-1 focus-visible:ring-offset-paper",
    "disabled:cursor-not-allowed disabled:opacity-50",
  ],
  {
    variants: {
      state: {
        default: "border-line hover:border-line-strong focus-visible:border-brand",
        error:
          "border-danger/60 bg-danger/[0.03] hover:border-danger focus-visible:border-danger focus-visible:ring-danger/40",
        success: "border-success/60 focus-visible:border-success",
      },
      density: {
        default: "min-h-[96px]",
        compact: "min-h-[72px]",
        tall: "min-h-[160px]",
      },
    },
    defaultVariants: { state: "default", density: "default" },
  },
);

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    VariantProps<typeof textareaVariants> {}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, state, density, ...props }, ref) => (
    <textarea
      ref={ref}
      aria-invalid={state === "error" ? true : undefined}
      className={cn(textareaVariants({ state, density }), className)}
      {...props}
    />
  ),
);
Textarea.displayName = "Textarea";
