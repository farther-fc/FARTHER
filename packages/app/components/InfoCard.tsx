import { cn } from "@lib/utils";
import React from "react";

export function InfoCard({
  variant,
  className,
  children,
}: {
  children: React.ReactNode;
  variant?: "ghost" | "warning" | "attention";
  className?: string;
}) {
  return (
    <div
      className={cn(
        `border-ghost my-6 rounded-xl border p-4 md:p-8`,
        variant === "ghost"
          ? "text-muted"
          : variant === "warning"
            ? "border-red-900"
            : variant === "attention"
              ? "border-link border-2"
              : "",
        className,
      )}
    >
      {children}
    </div>
  );
}
