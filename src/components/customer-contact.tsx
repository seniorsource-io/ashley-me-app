"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  customerIntakeSchema,
  type CustomerIntakeFormData,
} from "@/lib/schemas";
import { submitCustomerIntake } from "@/app/actions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";

export default function CustomerContact() {
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [submitError, setSubmitError] = useState("");

  const form = useForm<CustomerIntakeFormData>({
    resolver: zodResolver(customerIntakeSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      mobilePhone: "",
    },
  });

  async function onSubmit(data: CustomerIntakeFormData) {
    setSubmitStatus("loading");
    setSubmitError("");

    const result = await submitCustomerIntake(data);

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
          Thank you for reaching out!
        </h3>
        <p className="text-sm text-muted-foreground">
          A placement specialist will contact you shortly.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="flex flex-col gap-4"
    >
      <div className="grid grid-cols-2 gap-3">
        <Controller
          name="firstName"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name} className="text-xs">
                First name
              </FieldLabel>
              <Input
                {...field}
                id={field.name}
                aria-invalid={fieldState.invalid}
                placeholder="Jane"
                className="h-10"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="lastName"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name} className="text-xs">
                Last name
              </FieldLabel>
              <Input
                {...field}
                id={field.name}
                aria-invalid={fieldState.invalid}
                placeholder="Smith"
                className="h-10"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </div>

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

      <Controller
        name="mobilePhone"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name} className="text-xs">
              Mobile phone (optional)
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
