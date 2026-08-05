import { type ReactNode } from "react";

import { cn } from "@/shared/lib";

export type PageContainerProps = {
  children: ReactNode;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "full" | "7xl";
  padding?: "none" | "sm" | "md" | "lg";
  className?: string;
};

const maxWidthClasses = {
  sm: "max-w-screen-sm",
  md: "max-w-screen-md",
  lg: "max-w-screen-lg",
  xl: "max-w-screen-xl",
  "2xl": "max-w-screen-2xl",
  "7xl": "max-w-7xl",
  full: "max-w-full",
} as const;

const paddingClasses = {
  none: "",
  sm: "px-2 sm:px-4",
  md: "px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16",
  lg: "px-6 sm:px-8 lg:px-12 xl:px-16 2xl:px-24",
} as const;

export function PageContainer({ children, maxWidth = "7xl", padding = "md", className }: PageContainerProps) {
  return <main className={cn("mx-auto w-full", maxWidthClasses[maxWidth], paddingClasses[padding], className)}>{children}</main>;
}
