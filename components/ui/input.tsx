import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const inputVariants = cva(
  [
    "flex w-full rounded-md border bg-paper-raised px-3 text-ink",
    "placeholder:text-ink-subtle",
    "transition-colors duration-sm",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:ring-offset-1 focus-visible:ring-offset-paper",
    "disabled:cursor-not-allowed disabled:opacity-50",
  ],
  {
    variants: {
      size: {
        sm: "h-9 py-1.5 text-[13px]",
        md: "h-10 py-2 text-sm",
        lg: "h-12 py-3 text-base",
      },
      state: {
        default: "border-line hover:border-line-strong focus-visible:border-brand",
        error:
          "border-danger/60 bg-danger/[0.03] hover:border-danger focus-visible:border-danger focus-visible:ring-danger/40",
        success: "border-success/60 focus-visible:border-success",
      },
    },
    defaultVariants: { size: "md", state: "default" },
  },
);

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size">,
    VariantProps<typeof inputVariants> {}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", size, state, ...props }, ref) => (
    <input
      ref={ref}
      type={type}
      aria-invalid={state === "error" ? true : undefined}
      className={cn(inputVariants({ size, state }), className)}
      {...props}
    />
  ),
);
Input.displayName = "Input";
