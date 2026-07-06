"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { FormInputField } from "@/components/common/form-input-field";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  EMPLOYMENT_TYPE_OPTIONS,
  type EmploymentType,
  type Product,
  SALARY_TYPE_OPTIONS,
  type SalaryType,
} from "@/features/products/types";
import { cn } from "@/lib/utils";

// Define the schema for product form validation using Zod. This schema specifies the expected structure and validation rules for the product form inputs.
const productFormSchema = z
  .object({
    name: z.string().min(1, "Product name is required"),
    description: z.string().min(1, "Description is required"),
    minAge: z.coerce.number().int().min(18, "Minimum age must be at least 18"),
    maxAge: z.coerce.number().int().min(18, "Maximum age must be at least 18"),
    minCreditScore: z.coerce
      .number()
      .int()
      .min(300, "Credit score must be at least 300")
      .max(900, "Credit score cannot exceed 900"),
    allowedEmploymentTypes: z
      .array(
        z.enum(["SALARIED", "SELF_EMPLOYED"]),
      )
      .min(1, "Select at least one employment type"),
    allowedSalaryTypes: z
      .array(z.enum(["BANK_TRANSFER", "CHEQUE", "CASH"]))
      .min(1, "Select at least one salary type"),
    minSalary: z.coerce
      .number()
      .positive("Minimum salary must be greater than 0"),
  })
  .superRefine((values, context) => {
    if (values.maxAge <= values.minAge) {
      context.addIssue({
        code: "custom",
        message: "Maximum age must be greater than minimum age",
        path: ["maxAge"],
      });
    }
  });

type ProductFormInput = z.input<typeof productFormSchema>;

export type ProductFormValues = z.output<typeof productFormSchema>;

// Define the props for the ProductForm component, including default values, cancel and submit handlers, and the label for the submit button.
type ProductFormProps = {
  defaultValues?: Product;
  onCancel: () => void;
  onSubmit: (values: ProductFormValues) => Promise<void> | void;
  submitLabel: string;
};

const emptyDefaultValues: ProductFormInput = {
  name: "",
  description: "",
  minAge: 21,
  maxAge: 58,
  minCreditScore: 700,
  allowedEmploymentTypes: ["SALARIED"],
  allowedSalaryTypes: ["BANK_TRANSFER"],
  minSalary: 25000,
};

export const ProductForm = ({
  defaultValues,
  onCancel,
  onSubmit,
  submitLabel,
}: ProductFormProps) => {
  const form = useForm<ProductFormInput, unknown, ProductFormValues>({
    defaultValues: defaultValues ?? emptyDefaultValues,
    resolver: zodResolver(productFormSchema),
  });

  const [selectedEmploymentTypes, selectedSalaryTypes] = useWatch({
    control: form.control,
    name: ["allowedEmploymentTypes", "allowedSalaryTypes"],
  });

  // Toggle the selection of an employment type in the form. If the employment type is already selected, it will be removed; otherwise, it will be added to the list of selected employment types.
  const toggleEmploymentType = (value: EmploymentType) => {
    const currentValues = selectedEmploymentTypes ?? [];
    form.setValue(
      "allowedEmploymentTypes",
      currentValues.includes(value)
        ? currentValues.filter((item) => item !== value)
        : [...currentValues, value],
      { shouldDirty: true, shouldValidate: true },
    );
  };

  // Toggle the selection of a salary type in the form. If the salary type is already selected, it will be removed; otherwise, it will be added to the list of selected salary types.
  const toggleSalaryType = (value: SalaryType) => {
    const currentValues = selectedSalaryTypes ?? [];
    form.setValue(
      "allowedSalaryTypes",
      currentValues.includes(value)
        ? currentValues.filter((item) => item !== value)
        : [...currentValues, value],
      { shouldDirty: true, shouldValidate: true },
    );
  };

  return (
    <form
      className="flex flex-col gap-6"
      onSubmit={form.handleSubmit(onSubmit)}
    >
      <FieldGroup className="gap-4">
        <div className="grid gap-4 md:grid-cols-2">
          <FormInputField
            id="product-name"
            label="Product Name"
            name="name"
            register={form.register}
            error={form.formState.errors.name}
            placeholder="Personal Loan"
          />

          <FormInputField
            id="product-min-salary"
            label="Minimum Monthly Salary"
            name="minSalary"
            register={form.register}
            error={form.formState.errors.minSalary}
            type="number"
            min={0}
          />
        </div>

        <FormInputField
          id="product-description"
          label="Product Description"
          name="description"
          register={form.register}
          error={form.formState.errors.description}
          placeholder="Describe the loan product"
        />

        <div className="grid gap-4 md:grid-cols-3">
          <FormInputField
            id="product-min-age"
            label="Minimum Age"
            name="minAge"
            register={form.register}
            error={form.formState.errors.minAge}
            type="number"
            min={18}
          />

          <FormInputField
            id="product-max-age"
            label="Maximum Age"
            name="maxAge"
            register={form.register}
            error={form.formState.errors.maxAge}
            type="number"
            min={18}
          />

          <FormInputField
            id="product-credit-score"
            label="Minimum Credit Score"
            name="minCreditScore"
            register={form.register}
            error={form.formState.errors.minCreditScore}
            type="number"
            min={300}
            max={900}
          />
        </div>

        <Field
          data-invalid={Boolean(form.formState.errors.allowedEmploymentTypes)}
        >
          <FieldLabel>Employment Types</FieldLabel>
          <div className="flex flex-wrap gap-2">
            {EMPLOYMENT_TYPE_OPTIONS.map((option) => (
              <Button
                key={option.value}
                type="button"
                variant={
                  selectedEmploymentTypes?.includes(option.value)
                    ? "default"
                    : "outline"
                }
                size="sm"
                onClick={() => toggleEmploymentType(option.value)}
              >
                {option.label}
              </Button>
            ))}
          </div>
          <FieldError errors={[form.formState.errors.allowedEmploymentTypes]} />
        </Field>

        <Field data-invalid={Boolean(form.formState.errors.allowedSalaryTypes)}>
          <FieldLabel>Salary Types</FieldLabel>
          <div className="flex flex-wrap gap-2">
            {SALARY_TYPE_OPTIONS.map((option) => (
              <Button
                key={option.value}
                type="button"
                variant={
                  selectedSalaryTypes?.includes(option.value)
                    ? "default"
                    : "outline"
                }
                size="sm"
                onClick={() => toggleSalaryType(option.value)}
              >
                {option.label}
              </Button>
            ))}
          </div>
          <FieldError errors={[form.formState.errors.allowedSalaryTypes]} />
        </Field>
      </FieldGroup>

      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={form.formState.isSubmitting}
          className={cn(form.formState.isSubmitting && "opacity-80")}
        >
          {submitLabel}
        </Button>
      </div>
    </form>
  );
};
