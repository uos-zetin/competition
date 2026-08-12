import { BrandMark, LoadingSpinner } from "@/widgets/layout";

export type LoadingPageProps = {
  message?: string;
};

export function LoadingPage({ message = "불러오는 중입니다..." }: LoadingPageProps) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 p-4 text-center">
      <BrandMark />
      <LoadingSpinner size="xl" message={message} />
    </div>
  );
}
