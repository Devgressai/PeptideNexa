import { Info } from "lucide-react";
import { cn } from "@/lib/utils";

type Variant = "default" | "strong";

type DisclaimerBannerProps = {
  variant?: Variant;
  className?: string;
  children?: React.ReactNode;
};

export function DisclaimerBanner({
  variant = "default",
  className,
  children,
}: DisclaimerBannerProps) {
  return (
    <aside
      role="note"
      className={cn(
        "flex gap-3 rounded-lg border p-4 text-sm",
        variant === "default" && "border-line bg-paper-raised text-ink-muted",
        variant === "strong" && "border-signal/30 bg-signal/10 text-ink",
        className,
      )}
    >
      <Info aria-hidden className="mt-0.5 h-4 w-4 flex-shrink-0 text-signal" />
      <div className="space-y-1">
        {children ?? (
          <p>
            <strong className="font-semibold text-ink">Educational and informational use only.</strong>{" "}
            This page summarizes publicly available information and is not medical advice. Always
            consult a qualified clinician before making any health decision.
          </p>
        )}
      </div>
    </aside>
  );
}
