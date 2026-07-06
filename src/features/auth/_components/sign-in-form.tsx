"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { EyeIcon, EyeOffIcon, ShieldCheckIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";

import { FormInputField } from "@/components/common/form-input-field";
import { Button } from "@/components/ui/button";
import { FieldGroup } from "@/components/ui/field";
import { cn } from "@/lib/utils";
import { useLogin } from "../hooks/use-auth";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";

const adminSignInSchema = z.object({
    email: z
        .string()
        .min(1, "Email is required")
        .email("Enter a valid admin email"),
    password: z.string().min(8, "Password must be at least 8 characters"),
});

type AdminSignInFormValues = z.infer<typeof adminSignInSchema>;

export function LoginForm({
    className,
    ...props
}: React.ComponentProps<"div">) {
    const router = useRouter();
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const {mutate: onLogin, isPending, isError} = useLogin();

    // Initialize the form with React Hook Form and Zod resolver   
    const form = useForm<AdminSignInFormValues>({
        defaultValues: {
            email: "",
            password: "",
        },
        resolver: zodResolver(adminSignInSchema),
    });

    //   Watch the email and password fields to determine if they have values
    const [email, password] = useWatch({
        control: form.control,
        name: ["email", "password"],
    });

    //   Check if both email and password fields have non-empty values
    const hasRequiredValues = Boolean(email?.trim() && password?.trim());

    const onSubmit = () => {
        onLogin({
            email: email?.trim(),
            password: password?.trim()
        }, {
            onSuccess: (data) => {
                router.push("/users");
                toast.success(data.message);
            },
            onError: (error: any) => {
                toast.error(error?.response?.data?.message || "Login failed. Please try again.");
            }
        });
    };

    return (
        <main className={cn("flex w-full flex-col", className)} {...props}>
            <div className="mb-8 flex flex-col gap-1">
                <h1 className="font-aeonik-bold text-3xl tracking-wide text-deep-cyan">
                    Welcome Back 👋
                </h1>
                <p className="font-aeonik text-base tracking-tight text-muted-foreground">
                    Sign in to manage loan products and evaluate customer eligibility.
                </p>
            </div>
            <form
                className="flex flex-col gap-5"
                onSubmit={form.handleSubmit(onSubmit)}
            >
                <FieldGroup className="gap-5">
                    <FormInputField<AdminSignInFormValues>
                        error={form.formState.errors.email}
                        id="admin-email"
                        inputClassName="h-11 rounded-md bg-[#EBEBF2] px-4 py-2.5 font-aeonik"
                        label="Email"
                        name="email"
                        placeholder="Email"
                        register={form.register}
                        type="email"
                    />

                    <FormInputField<AdminSignInFormValues>
                        error={form.formState.errors.password}
                        id="admin-password"
                        inputClassName="h-11 rounded-md bg-[#EBEBF2] px-4 py-2.5 pr-11 font-aeonik"
                        label="Password"
                        name="password"
                        placeholder="Password"
                        register={form.register}
                        rightElement={
                            <button
                                type="button"
                                className="absolute top-1/2 right-3 -translate-y-1/2 p-2 text-muted-foreground hover:text-foreground"
                                onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                                aria-label={
                                    isPasswordVisible ? "Hide password" : "Show password"
                                }
                            >
                                {isPasswordVisible ? (
                                    <EyeOffIcon className="size-5" />
                                ) : (
                                    <EyeIcon className="size-5" />
                                )}
                            </button>
                        }
                        type={isPasswordVisible ? "text" : "password"}
                    />

                    <Button
                        className="w-full"
                        disabled={!hasRequiredValues || isPending}
                        type="submit"
                    >
                        {isPending ? (
                            <>
                                <Spinner/>
                                Signing in...
                            </>
                        ) : (
                            <>
                                <ShieldCheckIcon className="size-4" />
                                Sign in
                            </>
                        )}
                    </Button>
                </FieldGroup>
            </form>
        </main>
    );
}

export { LoginForm as AdminSignInScreen };
