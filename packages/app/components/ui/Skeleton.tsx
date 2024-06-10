import { cn } from "@lib/utils";

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "bg-ghost h-[100px] w-full animate-pulse rounded-lg",
        className,
      )}
      {...props}
    />
  );
}

export { Skeleton };
