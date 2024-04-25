import { cn } from "@lib/utils";
import React from "react";

export function InfoCard({
  variant,
  className,
  children,
}: {
  children: React.ReactNode;
  variant?: "muted" | "warning";
  className?: string;
}) {
  return (
    <p
      className={cn(
        `my-6 rounded-xl border p-4 md:p-8`,
        variant === "muted"
          ? "text-muted"
          : variant === "warning"
            ? "border-red-900"
            : "",
        className,
      )}
    >
      {children}
    </p>
  );
}
