import { AlertCircle, Info, ShieldAlert, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

type Tone = "info" | "warning" | "success" | "accent";

const toneStyles: Record<Tone, { wrapper: string; icon: string; Icon: typeof Info }> = {
  info: {
    wrapper: "border-line bg-paper-raised text-ink-muted",
    icon: "text-brand",
    Icon: Info,
  },
  warning: {
    wrapper: "border-signal/30 bg-signal/10 text-ink",
    icon: "text-signal",
    Icon: ShieldAlert,
  },
  success: {
    wrapper: "border-success/30 bg-success/10 text-ink",
    icon: "text-success",
    Icon: Sparkles,
  },
  accent: {
    wrapper: "border-brand/30 bg-brand/10 text-ink",
    icon: "text-brand",
    Icon: AlertCircle,
  },
};

type CalloutProps = {
  tone?: Tone;
  title?: string;
  children: React.ReactNode;
};

export function Callout({ tone = "info", title, children }: CalloutProps) {
  const { wrapper, icon, Icon } = toneStyles[tone];
  return (
    <aside
      role="note"
      className={cn("my-8 flex gap-3 rounded-lg border p-4 text-sm", wrapper)}
    >
      <Icon aria-hidden className={cn("mt-0.5 h-4 w-4 flex-shrink-0", icon)} />
      <div className="space-y-2">
        {title ? <p className="font-semibold text-ink">{title}</p> : null}
        <div className="[&>p:first-child]:mt-0">{children}</div>
      </div>
    </aside>
  );
}
