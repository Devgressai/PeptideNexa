"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { newsletterInputSchema, type NewsletterInput } from "@/lib/validators/newsletter";
import { cn } from "@/lib/utils";

type NewsletterFormProps = {
  source?: string;
  className?: string;
};

export function NewsletterForm({ source = "footer", className }: NewsletterFormProps) {
  const [submitted, setSubmitted] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const form = useForm<NewsletterInput>({
    resolver: zodResolver(newsletterInputSchema),
    defaultValues: { email: "", source, company: "" },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    setError(null);
    const res = await fetch("/api/newsletter", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(values),
    });
    if (!res.ok) {
      setError("Couldn't subscribe. Try again in a moment.");
      return;
    }
    setSubmitted(true);
  });

  if (submitted) {
    return (
      <p className={cn("text-sm text-ink", className)}>
        You&rsquo;re in. Watch for our next research digest.
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} className={cn("flex flex-col gap-2", className)} noValidate>
      <div aria-hidden className="hidden">
        <Input tabIndex={-1} autoComplete="off" {...form.register("company")} />
      </div>
      <div className="flex flex-col gap-2 sm:flex-row">
        <Input
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          aria-label="Email address"
          required
          {...form.register("email")}
        />
        <Button type="submit" disabled={form.formState.isSubmitting}>
          Subscribe
        </Button>
      </div>
      {error ? (
        <p role="alert" className="text-xs text-danger">
          {error}
        </p>
      ) : null}
      <p className="text-xs text-ink-subtle">
        A short, careful research digest. Unsubscribe anytime.
      </p>
    </form>
  );
}
