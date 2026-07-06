import { ModeToggle } from "@/components/common/mode-toggle";
import { LoginForm } from "@/features/auth/_components/sign-in-form";
import { requireUnAuth } from "@/lib/auth-utils";

const SignInPage = async () => {
  await requireUnAuth();
  return (
    <main className="relative flex min-h-svh flex-col items-center justify-center gap-6 bg-background p-6 md:p-10">
      <div className="absolute top-6 right-6">
        <ModeToggle />
      </div>
      <div className="w-full max-w-sm">
        <LoginForm />
      </div>
    </main>
  );
};

export default SignInPage;
