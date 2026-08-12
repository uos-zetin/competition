import { LoginForm } from "@/features/auth";
import { BrandMark } from "@/widgets/layout";

export function HomeLoginScreen() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-8">
      <div className="flex w-full flex-col items-center gap-6">
        <BrandMark />
        <LoginForm />
      </div>
    </div>
  );
}
