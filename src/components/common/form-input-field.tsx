"use client";

import type {
  FieldValues,
  FieldError as HookFormFieldError,
  FieldErrorsImpl,
  Merge,
  Path,
  UseFormRegister,
} from "react-hook-form";

import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

// Props for the reusable form input
type FormInputFieldProps<TFieldValues extends FieldValues> = Omit<
  React.ComponentProps<typeof Input>,
  "name"
> & {
  error?: HookFormFieldError | Merge<HookFormFieldError, FieldErrorsImpl<any>>;
  inputClassName?: string;
  label: string;
  name: Path<TFieldValues>;
  register: UseFormRegister<TFieldValues>;
  rightElement?: React.ReactNode;
};

// Reusable input component with React Hook Form
export const FormInputField = <TFieldValues extends FieldValues>({
  className,
  error,
  id,
  inputClassName,
  label,
  name,
  register,
  rightElement,
  ...props
}: FormInputFieldProps<TFieldValues>) => {
  return (
    // Field wrapper
    <Field className={className} data-invalid={Boolean(error)}>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>

      {/* Input container */}
      <div className="relative">
        <Input
          id={id}
          aria-invalid={Boolean(error)}
          className={cn(rightElement && "pr-10", inputClassName)}
          // Register field with React Hook Form
          {...register(name)}
          {...props}
        />

        {/* Optional right-side element */}
        {rightElement}
      </div>

      {/* Validation error */}
      <FieldError errors={[error]} />
    </Field>
  );
};