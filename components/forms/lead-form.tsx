"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
      <div className={cn("rounded-lg border border-line bg-paper p-6", className)}>
        <p className="font-serif text-lg text-ink">Thanks — we&rsquo;ll be in touch shortly.</p>
        <p className="mt-2 text-sm text-ink-muted">
          We&rsquo;ll review your request and share a short list of providers that fit what you
          described. No pressure, no spam.
        </p>
      </div>
    );
  }

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
        <Field
          label="Email"
          htmlFor="email"
          error={form.formState.errors.email?.message}
          required
        >
          <Input
            id="email"
            type="email"
            autoComplete="email"
            inputMode="email"
            {...form.register("email")}
          />
        </Field>

        <Field label="Name" htmlFor="name" error={form.formState.errors.name?.message}>
          <Input id="name" autoComplete="name" {...form.register("name")} />
        </Field>
      </div>

      <div className={cn("grid gap-4", !compact && "sm:grid-cols-2")}>
        <Field label="Phone (optional)" htmlFor="phone" error={form.formState.errors.phone?.message}>
          <Input id="phone" type="tel" autoComplete="tel" {...form.register("phone")} />
        </Field>

        <Field label="State" htmlFor="locationState" error={form.formState.errors.locationState?.message}>
          <Input
            id="locationState"
            maxLength={2}
            placeholder="TX"
            className="uppercase"
            {...form.register("locationState")}
          />
        </Field>
      </div>

      <Field label="Budget" htmlFor="budgetTier" error={form.formState.errors.budgetTier?.message}>
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
      </Field>

      <Field label="Anything else we should know?" htmlFor="notes" error={form.formState.errors.notes?.message}>
        <Textarea id="notes" rows={4} {...form.register("notes")} />
      </Field>

      <label className="flex items-start gap-2 text-xs text-ink-muted">
        <input
          type="checkbox"
          className="mt-0.5 h-4 w-4 rounded border-line"
          {...form.register("consent")}
        />
        <span>
          I agree to be contacted about peptide providers and understand PeptideNexa is not a medical
          provider.
        </span>
      </label>

      {errorMessage ? (
        <p role="alert" className="text-sm text-danger">
          {errorMessage}
        </p>
      ) : null}

      <Button type="submit" disabled={status === "submitting"} size="lg">
        {status === "submitting" ? "Submitting…" : "Request matches"}
      </Button>

      <p id="lead-disclaimer" className="text-xs text-ink-subtle">
        Educational and informational use only. Not medical advice.
      </p>
    </form>
  );
}

type FieldProps = {
  label: string;
  htmlFor: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
};

function Field({ label, htmlFor, error, required, children }: FieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={htmlFor}>
        {label}
        {required ? <span aria-hidden className="ml-1 text-danger">*</span> : null}
      </Label>
      {children}
      {error ? (
        <p className="text-xs text-danger" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
