"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, type SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { User } from "@/features/users/types";
import { useCreateUser } from "../hooks/use-users";

const MAX_MONTHLY_SALARY = 99999999.99;

const getErrorMessage = (error: unknown, fallback: string) => {
  if (
    typeof error === "object" &&
    error !== null &&
    "response" in error &&
    typeof error.response === "object" &&
    error.response !== null &&
    "data" in error.response &&
    typeof error.response.data === "object" &&
    error.response.data !== null &&
    "message" in error.response.data &&
    typeof error.response.data.message === "string"
  ) {
    return error.response.data.message;
  }

  return fallback;
};

const userSchema = z.object({
  fullName: z.string().trim().min(2, "Name is required."),
  dateOfBirth: z.string().min(1, "Date of birth is required."),
  creditScore: z.preprocess(
    (value) => Number(value),
    z.number().min(300).max(900),
  ),
  employmentType: z.enum(["SALARIED", "SELF_EMPLOYED"]),
  salaryType: z.enum(["BANK_TRANSFER", "CASH", "CHEQUE"]),
  monthlySalary: z.preprocess(
    (value) => Number(value),
    z
      .number()
      .positive()
      .max(MAX_MONTHLY_SALARY, "Monthly salary cannot exceed 99,999,999.99"),
  ),
});

export type UserFormValues = z.infer<typeof userSchema>;

type UserFormProps = {
  defaultValues?: User;
  onCancel: () => void;
  submitLabel: string;
  onSubmit?: (values: UserFormValues) => void;
};

export const UserForm = ({
  defaultValues,
  onCancel,
  submitLabel,
  onSubmit,
}: UserFormProps) => {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      fullName: defaultValues?.fullName ?? "",
      dateOfBirth: defaultValues?.dateOfBirth ?? "",
      creditScore: defaultValues?.creditScore ?? 750,
      employmentType: defaultValues?.employmentType ?? "SALARIED",
      salaryType: defaultValues?.salaryType ?? "BANK_TRANSFER",
      monthlySalary: Number(defaultValues?.monthlySalary ?? 0),
    },
  });

  const { mutate: createUser, isPending } = useCreateUser();

  const handleCreateUser: SubmitHandler<UserFormValues> = (payload) => {
    onSubmit?.(payload);

    createUser(payload, {
      onSuccess: () => {
        toast.success("User created successfully");
        onCancel();
      },
      onError: (error: unknown) => {
        toast.error(getErrorMessage(error, "Failed to create user"));
      },
    });
  };

  return (
    <form onSubmit={handleSubmit(handleCreateUser)} className="space-y-6">
      <FieldGroup className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <FormInputField
          id="fullName"
          label="Full Name"
          name="fullName"
          register={register}
          error={errors.fullName}
          placeholder="Enter full name"
        />

        <FormInputField
          id="dateOfBirth"
          label="Date of Birth"
          name="dateOfBirth"
          register={register}
          error={errors.dateOfBirth}
          type="date"
        />

        <FormInputField
          id="creditScore"
          label="Credit Score"
          name="creditScore"
          register={register}
          error={errors.creditScore}
          type="number"
          placeholder="750"
        />

        <FormInputField
          id="monthlySalary"
          label="Monthly Salary"
          name="monthlySalary"
          register={register}
          error={errors.monthlySalary}
          type="number"
          max={MAX_MONTHLY_SALARY}
          step="0.01"
          placeholder="50000"
        />

        <Controller
          control={control}
          name="employmentType"
          render={({ field }) => (
            <Field data-invalid={!!errors.employmentType}>
              <FieldLabel>Employment Type</FieldLabel>

              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select employment type" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="SALARIED">Salaried</SelectItem>
                  <SelectItem value="SELF_EMPLOYED">Self Employed</SelectItem>
                </SelectContent>
              </Select>

              <FieldError errors={[errors.employmentType]} />
            </Field>
          )}
        />

        <Controller
          control={control}
          name="salaryType"
          render={({ field }) => (
            <Field data-invalid={!!errors.salaryType}>
              <FieldLabel>Salary Type</FieldLabel>

              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select salary type" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="BANK_TRANSFER">Bank Transfer</SelectItem>
                  <SelectItem value="CASH">Cash</SelectItem>
                  <SelectItem value="CHEQUE">Cheque</SelectItem>
                </SelectContent>
              </Select>

              <FieldError errors={[errors.salaryType]} />
            </Field>
          )}
        />
      </FieldGroup>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>

        <Button type="submit" disabled={isSubmitting}>
          {isPending ? "Creating..." : submitLabel}
        </Button>
      </div>
    </form>
  );
};

export default UserForm;
