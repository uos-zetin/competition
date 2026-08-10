import { cva } from "class-variance-authority";

export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive cursor-pointer",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow-xs hover:brightness-105 hover:ring-[1.5px] hover:ring-primary/55",
        success: "bg-emerald-600 text-white shadow-xs hover:brightness-105 hover:ring-[1.5px] hover:ring-emerald-600/55 dark:bg-emerald-600/80",
        destructive:
          "bg-destructive text-white shadow-xs hover:brightness-105 hover:ring-[1.5px] hover:ring-destructive/55 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "border bg-background shadow-xs hover:bg-foreground/12 hover:text-accent-foreground hover:border-foreground hover:ring-[1.5px] hover:ring-foreground/30 dark:bg-input/30 dark:border-input dark:hover:bg-foreground/12",
        secondary: "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80",
        ghost: "hover:bg-foreground/12 hover:text-accent-foreground dark:hover:bg-foreground/12",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);
