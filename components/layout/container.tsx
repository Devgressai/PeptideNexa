import * as React from "react";
import { cn } from "@/lib/utils";

type Width = "default" | "narrow" | "wide" | "full";

const widthStyles: Record<Width, string> = {
  default: "max-w-[1200px]",
  narrow: "max-w-readable",
  wide: "max-w-[1440px]",
  full: "max-w-none",
};

type ContainerProps = React.HTMLAttributes<HTMLDivElement> & {
  width?: Width;
  as?: keyof React.JSX.IntrinsicElements;
};

export function Container({
  className,
  width = "default",
  as: Component = "div",
  ...props
}: ContainerProps) {
  return (
    <Component
      className={cn("mx-auto w-full px-4 md:px-6 lg:px-8", widthStyles[width], className)}
      {...(props as Record<string, unknown>)}
    />
  );
}
