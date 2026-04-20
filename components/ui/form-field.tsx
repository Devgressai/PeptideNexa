import * as React from "react";
import { Label } from "./label";
import { cn } from "@/lib/utils";

type FormFieldProps = {
  /** ID that associates the label with the control. */
  htmlFor: string;
  label: React.ReactNode;
  /** Helper text rendered under the control when there is no error. */
  hint?: React.ReactNode;
  /** Inline error message. When set, the field enters error state. */
  error?: string;
  /** Marks the field visually as required. */
  required?: boolean;
  className?: string;
  children: React.ReactNode;
};

/**
 * Reusable label + control + hint/error wrapper. Keeps form layouts
 * consistent and ensures error messages are associated via aria-describedby.
 */
export function FormField({
  htmlFor,
  label,
  hint,
  error,
  required,
  className,
  children,
}: FormFieldProps) {
  const hintId = hint ? `${htmlFor}-hint` : undefined;
  const errorId = error ? `${htmlFor}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <Label htmlFor={htmlFor} required={required}>
        {label}
      </Label>
      {/* Children receive aria-describedby via React children cloning. */}
      {React.Children.map(children, (child) => {
        if (!React.isValidElement(child)) return child;
        return React.cloneElement(child as React.ReactElement<Record<string, unknown>>, {
          "aria-describedby": describedBy,
        });
      })}
      {error ? (
        <p id={errorId} role="alert" className="text-xs text-danger">
          {error}
        </p>
      ) : hint ? (
        <p id={hintId} className="text-xs text-ink-subtle">
          {hint}
        </p>
      ) : null}
    </div>
  );
}
