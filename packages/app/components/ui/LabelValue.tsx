export function LabelValue({
  label,
  value,
  variant,
}: {
  label: string;
  value?: string | number;
  variant?: "chill";
}) {
  return (
    <div className="flex items-center">
      <div className="text-muted mr-2">{label}:</div>
      <div className={`text-lg ${variant === "chill" ? "" : "font-bold"}`}>
        {value}
      </div>
    </div>
  );
}
