"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FormField } from "@/components/ui/form-field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { leadInputSchema, type LeadInput } from "@/lib/validators/lead";
import { cn } from "@/lib/utils";

type LeadFormProps = {
  source: string;
  className?: string;
  defaults?: Partial<LeadInput>;
  compact?: boolean;
};

type Status = "idle" | "submitting" | "success" | "error";

export function LeadForm({ source, className, defaults, compact = false }: LeadFormProps) {
  const [status, setStatus] = React.useState<Status>("idle");
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

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
      ...defaults,
    },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    setStatus("submitting");
    setErrorMessage(null);
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(data.error ?? "Something went wrong.");
      }
      setStatus("success");
      form.reset({ ...form.getValues(), email: "", name: "", phone: "", notes: "" });
    } catch (error) {
      setStatus("error");
      setErrorMessage(error instanceof Error ? error.message : "Unable to submit. Try again.");
    }
  });

  if (status === "success") {
    return (
      <div
        className={cn(
          "rounded-md border border-success/30 bg-success/5 p-6",
          className,
        )}
      >
        <p className="eyebrow text-success">Request received</p>
        <p className="mt-2 font-serif text-lg text-ink-strong">
          Thanks — we&rsquo;ll be in touch shortly.
        </p>
        <p className="mt-2 text-sm text-ink-muted">
          We&rsquo;ll review your request and share a short list of providers that fit what you
          described. No pressure, no spam.
        </p>
      </div>
    );
  }

  const err = form.formState.errors;

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className={cn("flex flex-col gap-4", className)}
      aria-describedby="lead-disclaimer"
    >
      {/* Honeypot — real users leave this empty. */}
      <div aria-hidden className="hidden">
        <Label htmlFor="company">Company</Label>
        <Input id="company" autoComplete="off" tabIndex={-1} {...form.register("company")} />
      </div>

      <div className={cn("grid gap-4", !compact && "sm:grid-cols-2")}>
        <FormField htmlFor="email" label="Email" error={err.email?.message} required>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            inputMode="email"
            state={err.email ? "error" : "default"}
            {...form.register("email")}
          />
        </FormField>

        <FormField htmlFor="name" label="Name" error={err.name?.message}>
          <Input
            id="name"
            autoComplete="name"
            state={err.name ? "error" : "default"}
            {...form.register("name")}
          />
        </FormField>
      </div>

      <div className={cn("grid gap-4", !compact && "sm:grid-cols-2")}>
        <FormField
          htmlFor="phone"
          label="Phone"
          hint="Optional"
          error={err.phone?.message}
        >
          <Input
            id="phone"
            type="tel"
            autoComplete="tel"
            state={err.phone ? "error" : "default"}
            {...form.register("phone")}
          />
        </FormField>

        <FormField
          htmlFor="locationState"
          label="State"
          hint="2-letter code"
          error={err.locationState?.message}
        >
          <Input
            id="locationState"
            maxLength={2}
            placeholder="TX"
            className="uppercase"
            state={err.locationState ? "error" : "default"}
            {...form.register("locationState")}
          />
        </FormField>
      </div>

      <FormField htmlFor="budgetTier" label="Budget" error={err.budgetTier?.message}>
        <Select
          onValueChange={(value) => form.setValue("budgetTier", value as LeadInput["budgetTier"])}
        >
          <SelectTrigger id="budgetTier">
            <SelectValue placeholder="Select a range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="UNDER_250">Under $250 / mo</SelectItem>
            <SelectItem value="MID">$250–$750 / mo</SelectItem>
            <SelectItem value="HIGH">$750+ / mo</SelectItem>
          </SelectContent>
        </Select>
      </FormField>

      <FormField
        htmlFor="notes"
        label="Anything else we should know?"
        error={err.notes?.message}
      >
        <Textarea
          id="notes"
          rows={4}
          state={err.notes ? "error" : "default"}
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

      {errorMessage ? (
        <p role="alert" className="text-sm text-danger">
          {errorMessage}
        </p>
      ) : null}

      <Button
        type="submit"
        disabled={status === "submitting"}
        size="lg"
        variant="brand"
      >
        {status === "submitting" ? "Submitting…" : "Request matches"}
      </Button>

      <p id="lead-disclaimer" className="text-xs text-ink-subtle">
        Educational and informational use only. Not medical advice.
      </p>
    </form>
  );
}
