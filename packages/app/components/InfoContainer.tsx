import { cn } from "@lib/utils";
import React from "react";

export function InfoContainer({
  variant,
  className,
  children,
}: {
  children: React.ReactNode;
  variant?: "muted";
  className?: string;
}) {
  return (
    <p
      className={cn(
        `my-6 rounded-xl border p-8`,
        variant === "muted" ? "text-muted" : "",
        className,
      )}
    >
      {children}
    </p>
  );
}
