"use client";

import * as React from "react";
import type { Route } from "next";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FormField } from "@/components/ui/form-field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { leadInputSchema, type LeadInput } from "@/lib/validators/lead";
import { cn } from "@/lib/utils";

const STEPS = [
  { id: "goal", label: "Goal" },
  { id: "preference", label: "Preference" },
  { id: "location", label: "Location" },
  { id: "budget", label: "Budget" },
  { id: "contact", label: "Contact" },
] as const;

type StepId = (typeof STEPS)[number]["id"];

const GOALS: Array<{ slug: string; label: string; description: string }> = [
  { slug: "recovery", label: "Recovery", description: "Joint, soft-tissue, or post-exercise." },
  { slug: "sleep", label: "Sleep", description: "Quality, duration, or deep-sleep research." },
  { slug: "weight", label: "Weight", description: "Metabolic research and weight-management." },
  { slug: "longevity", label: "Longevity", description: "Broad healthspan and aging research." },
  { slug: "other", label: "Something else", description: "General research, not sure yet." },
];

// Which fields each step is allowed to submit/validate.
const STEP_FIELDS: Record<StepId, Array<keyof LeadInput>> = {
  goal: ["intentGoalSlug"],
  preference: ["onlineOk"],
  location: ["locationState"],
  budget: ["budgetTier"],
  contact: ["email", "name", "phone", "notes", "consent"],
};

type QuizStepperProps = {
  source: string;
};

export function QuizStepper({ source }: QuizStepperProps) {
  const router = useRouter();
  const [stepIndex, setStepIndex] = React.useState(0);
  const [serverError, setServerError] = React.useState<string | null>(null);

  const form = useForm<LeadInput>({
    resolver: zodResolver(leadInputSchema),
    defaultValues: {
      email: "",
      name: "",
      phone: "",
      source,
      onlineOk: true,
      notes: "",
      consent: true,
      locationState: "",
      intentGoalSlug: undefined,
      budgetTier: undefined,
    },
    mode: "onBlur",
  });

  const currentStep = STEPS[stepIndex]!;
  const isLast = stepIndex === STEPS.length - 1;

  async function next() {
    const valid = await form.trigger(STEP_FIELDS[currentStep.id]);
    if (!valid) return;
    setStepIndex((i) => Math.min(i + 1, STEPS.length - 1));
  }

  function back() {
    setStepIndex((i) => Math.max(i - 1, 0));
  }

  const onSubmit = form.handleSubmit(async (values) => {
    setServerError(null);
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(data.error ?? "Unable to submit. Try again.");
      }
      const data = (await res.json()) as { token?: string };
      if (!data.token) throw new Error("Submission accepted but no token returned.");
      router.push(`/match/result/${data.token}` as Route);
    } catch (error) {
      setServerError(error instanceof Error ? error.message : "Unable to submit.");
    }
  });

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-6">
      {/* Honeypot — real users leave this empty. */}
      <div aria-hidden className="hidden">
        <Label htmlFor="company">Company</Label>
        <Input id="company" autoComplete="off" tabIndex={-1} {...form.register("company")} />
      </div>

      <Progress stepIndex={stepIndex} />

      <div className="min-h-[280px]">
        {currentStep.id === "goal" ? <GoalStep form={form} /> : null}
        {currentStep.id === "preference" ? <PreferenceStep form={form} /> : null}
        {currentStep.id === "location" ? <LocationStep form={form} /> : null}
        {currentStep.id === "budget" ? <BudgetStep form={form} /> : null}
        {currentStep.id === "contact" ? <ContactStep form={form} /> : null}
      </div>

      {serverError ? (
        <p role="alert" className="text-sm text-danger">
          {serverError}
        </p>
      ) : null}

      <div className="flex items-center justify-between">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={back}
          disabled={stepIndex === 0}
          className="gap-1"
        >
          <ArrowLeft aria-hidden className="h-4 w-4" />
          Back
        </Button>

        {isLast ? (
          <Button type="submit" size="lg" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? "Submitting…" : "Request matches"}
          </Button>
        ) : (
          <Button type="button" size="lg" onClick={next} className="gap-1">
            Continue
            <ArrowRight aria-hidden className="h-4 w-4" />
          </Button>
        )}
      </div>

      <p className="text-xs text-ink-subtle">
        Educational and informational use only. Not medical advice.
      </p>
    </form>
  );
}

function Progress({ stepIndex }: { stepIndex: number }) {
  return (
    <ol aria-label="Steps" className="flex items-center gap-1">
      {STEPS.map((step, i) => (
        <li key={step.id} className="flex items-center gap-1">
          <span
            aria-current={i === stepIndex ? "step" : undefined}
            className={cn(
              "h-1 w-10 rounded-[1px] transition-colors duration-sm",
              i <= stepIndex ? "bg-brand" : "bg-line-strong",
            )}
          />
          {i < STEPS.length - 1 ? <span aria-hidden className="h-px w-1 bg-line" /> : null}
        </li>
      ))}
      <li className="ml-2 text-xs text-ink-subtle">
        Step {stepIndex + 1} of {STEPS.length}
      </li>
    </ol>
  );
}

type StepProps = { form: ReturnType<typeof useForm<LeadInput>> };

function GoalStep({ form }: StepProps) {
  const selected = form.watch("intentGoalSlug");
  return (
    <fieldset className="flex flex-col gap-4">
      <legend className="font-serif text-display-md text-ink-strong">
        What are you researching?
      </legend>
      <p className="text-sm text-ink-muted">Pick whichever is closest. You can refine later.</p>
      <div className="grid gap-2 sm:grid-cols-2">
        {GOALS.map((goal) => (
          <label
            key={goal.slug}
            className={cn(
              "flex cursor-pointer flex-col rounded-md border bg-paper-raised p-4 transition-colors duration-sm",
              selected === goal.slug
                ? "border-brand bg-brand-soft/40 ring-1 ring-brand"
                : "border-line hover:border-line-strong hover:bg-paper-sunken/50",
            )}
          >
            <input
              type="radio"
              className="sr-only"
              value={goal.slug}
              checked={selected === goal.slug}
              onChange={() => form.setValue("intentGoalSlug", goal.slug)}
            />
            <span className="font-medium text-ink-strong">{goal.label}</span>
            <span className="mt-1 text-xs leading-relaxed text-ink-muted">{goal.description}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

function PreferenceStep({ form }: StepProps) {
  const online = form.watch("onlineOk");
  return (
    <fieldset className="flex flex-col gap-4">
      <legend className="font-serif text-display-md text-ink-strong">
        Online or in person?
      </legend>
      <p className="text-sm text-ink-muted">
        Both are valid. Telehealth is more widely available; in-person clinics can be a better fit
        for some research directions.
      </p>
      <div className="grid gap-2 sm:grid-cols-2">
        <PreferenceOption
          label="Online is fine"
          description="Telehealth and shipped scripts where compliant."
          selected={online === true}
          onSelect={() => form.setValue("onlineOk", true)}
        />
        <PreferenceOption
          label="In-person only"
          description="Clinic consultations in my area."
          selected={online === false}
          onSelect={() => form.setValue("onlineOk", false)}
        />
      </div>
    </fieldset>
  );
}

function PreferenceOption({
  label,
  description,
  selected,
  onSelect,
}: {
  label: string;
  description: string;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <label
      className={cn(
        "flex cursor-pointer flex-col rounded-md border bg-paper-raised p-4 transition-colors duration-sm",
        selected
          ? "border-brand bg-brand-soft/40 ring-1 ring-brand"
          : "border-line hover:border-line-strong hover:bg-paper-sunken/50",
      )}
    >
      <input type="radio" className="sr-only" checked={selected} onChange={onSelect} />
      <span className="font-medium text-ink-strong">{label}</span>
      <span className="mt-1 text-xs leading-relaxed text-ink-muted">{description}</span>
    </label>
  );
}

function LocationStep({ form }: StepProps) {
  return (
    <fieldset className="flex flex-col gap-4">
      <legend className="font-serif text-display-md text-ink-strong">Where are you?</legend>
      <p className="text-sm text-ink-muted">
        We filter providers by licensing and reach. Two-letter state code.
      </p>
      <div className="max-w-[120px]">
        <Label htmlFor="state" className="sr-only">
          State
        </Label>
        <Input
          id="state"
          maxLength={2}
          placeholder="TX"
          className="uppercase tracking-wider"
          autoComplete="address-level1"
          {...form.register("locationState")}
        />
      </div>
      {form.formState.errors.locationState?.message ? (
        <p role="alert" className="text-xs text-danger">
          {form.formState.errors.locationState.message}
        </p>
      ) : null}
    </fieldset>
  );
}

function BudgetStep({ form }: StepProps) {
  return (
    <fieldset className="flex flex-col gap-4">
      <legend className="font-serif text-display-md text-ink-strong">
        Rough monthly budget
      </legend>
      <p className="text-sm text-ink-muted">
        Helps us surface providers in the right price range. Skip if you&rsquo;re not sure.
      </p>
      <div className="max-w-xs">
        <Select
          onValueChange={(value) => form.setValue("budgetTier", value as LeadInput["budgetTier"])}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="UNDER_250">Under $250 / mo</SelectItem>
            <SelectItem value="MID">$250–$750 / mo</SelectItem>
            <SelectItem value="HIGH">$750+ / mo</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </fieldset>
  );
}

function ContactStep({ form }: StepProps) {
  return (
    <fieldset className="flex flex-col gap-4">
      <legend className="font-serif text-display-md text-ink-strong">
        Where should we send matches?
      </legend>
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField htmlFor="email" label="Email" required error={form.formState.errors.email?.message}>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            state={form.formState.errors.email ? "error" : "default"}
            {...form.register("email")}
          />
        </FormField>
        <FormField htmlFor="name" label="Name" error={form.formState.errors.name?.message}>
          <Input
            id="name"
            autoComplete="name"
            state={form.formState.errors.name ? "error" : "default"}
            {...form.register("name")}
          />
        </FormField>
      </div>
      <FormField
        htmlFor="phone"
        label="Phone"
        hint="Optional"
        error={form.formState.errors.phone?.message}
      >
        <Input
          id="phone"
          type="tel"
          autoComplete="tel"
          state={form.formState.errors.phone ? "error" : "default"}
          {...form.register("phone")}
        />
      </FormField>
      <FormField
        htmlFor="notes"
        label="Anything else we should know?"
        error={form.formState.errors.notes?.message}
      >
        <Textarea
          id="notes"
          rows={3}
          state={form.formState.errors.notes ? "error" : "default"}
          {...form.register("notes")}
        />
      </FormField>
      <label className="flex items-start gap-2 text-xs leading-relaxed text-ink-muted">
        <input
          type="checkbox"
          className="mt-0.5 h-4 w-4 rounded-sm border-line-strong accent-brand"
          {...form.register("consent")}
        />
        <span>
          I agree to be contacted about peptide providers and understand PeptideNexa is not a
          medical provider.
        </span>
      </label>
    </fieldset>
  );
}
