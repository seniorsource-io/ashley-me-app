"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  communityInquirySchema,
  type CommunityInquiryFormData,
} from "@/lib/schemas";
import { submitCommunityInquiry } from "@/app/actions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";

export default function CommunityForm() {
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [submitError, setSubmitError] = useState("");

  const form = useForm<CommunityInquiryFormData>({
    resolver: zodResolver(communityInquirySchema),
    defaultValues: {
      name: "",
      careHomeName: "",
      address: "",
      phone: "",
      email: "",
    },
  });

  async function onSubmit(data: CommunityInquiryFormData) {
    setSubmitStatus("loading");
    setSubmitError("");

    const result = await submitCommunityInquiry(data);

    if (result.success) {
      setSubmitStatus("success");
    } else {
      setSubmitStatus("error");
      setSubmitError(result.error);
    }
  }

  if (submitStatus === "success") {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <h3 className="font-heading text-xl font-medium text-foreground mb-2">
          Thanks for reaching out!
        </h3>
        <p className="text-sm text-muted-foreground">
          We&apos;ll be in touch soon.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="flex flex-col gap-4"
    >
      <Controller
        name="name"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name} className="text-xs">
              Your name
            </FieldLabel>
            <Input
              {...field}
              id={field.name}
              aria-invalid={fieldState.invalid}
              placeholder="Jane Smith"
              className="h-10"
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <Controller
        name="careHomeName"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name} className="text-xs">
              Care home name
            </FieldLabel>
            <Input
              {...field}
              id={field.name}
              aria-invalid={fieldState.invalid}
              placeholder="Sunrise Adult Care Home"
              className="h-10"
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <Controller
        name="address"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name} className="text-xs">
              Care home address
            </FieldLabel>
            <Input
              {...field}
              id={field.name}
              aria-invalid={fieldState.invalid}
              placeholder="1234 SE Hawthorne Blvd, Portland, OR 97214"
              className="h-10"
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <div className="grid grid-cols-2 gap-3">
        <Controller
          name="phone"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name} className="text-xs">
                Phone
              </FieldLabel>
              <Input
                {...field}
                id={field.name}
                type="tel"
                aria-invalid={fieldState.invalid}
                placeholder="(503) 555-1234"
                className="h-10"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="email"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name} className="text-xs">
                Email
              </FieldLabel>
              <Input
                {...field}
                id={field.name}
                type="email"
                aria-invalid={fieldState.invalid}
                placeholder="jane@email.com"
                className="h-10"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </div>

      {submitStatus === "error" && (
        <p className="text-sm text-destructive">{submitError}</p>
      )}

      <Button
        type="submit"
        disabled={submitStatus === "loading"}
        size="lg"
        className="bg-foreground w-full mt-1 h-11 text-background text-[15px]"
      >
        {submitStatus === "loading" ? "Submitting..." : "Submit"}
      </Button>
    </form>
  );
}
