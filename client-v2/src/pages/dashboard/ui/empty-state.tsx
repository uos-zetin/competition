type EmptyStateProps = {
  icon: string;
  title: string;
  description: string;
  variant?: "page" | "sub";
};

export function EmptyState({ icon, title, description, variant = "page" }: EmptyStateProps) {
  return (
    <section
      className={`flex flex-col items-center justify-center rounded-xl border border-dashed bg-card px-6 text-center ${
        variant === "sub" ? "py-7" : "py-10"
      }`}
    >
      <div className="mb-3 flex size-11 items-center justify-center rounded-full bg-muted text-xl text-muted-foreground">{icon}</div>
      <h2 className="text-base font-bold">{title}</h2>
      <p className="mt-1.5 text-sm text-muted-foreground">{description}</p>
    </section>
  );
}
