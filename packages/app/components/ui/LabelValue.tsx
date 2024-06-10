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
    <div className="flex ">
      <div className="text-muted mr-2">{label}:</div>
      <div className={`text-lg ${variant === "chill" ? "" : "font-normal"}`}>
        {value}
      </div>
    </div>
  );
}
