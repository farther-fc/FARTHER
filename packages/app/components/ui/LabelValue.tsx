import { cn } from "@lib/utils";

export function LabelValue({
  label,
  value,
  variant,
  className,
  align = "start",
}: {
  label: string;
  value?: string | number;
  variant?: "chill";
  className?: string;
  align?: "start" | "end";
}) {
  return (
    <div className={cn("flex", `justify-${align}`, className)}>
      <div className="text-muted mr-2">{label}:</div>
      <div className={variant === "chill" ? "" : "font-normal"}>{value}</div>
    </div>
  );
}
