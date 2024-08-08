import { Button } from "@components/ui/Button";
import { Popover } from "@components/ui/Popover";
import { Info } from "lucide-react";

export function ButtonWithPopover({
  text,
  content,
  variant = "primary",
}: {
  text: string;
  content: React.ReactNode;
  variant?: "primary" | "danger";
}) {
  return (
    <Popover content={<>{content}</>}>
      <div>
        <Button
          sentryId=""
          disabled={true}
          className={`w-tableButton md:w-tableButtonWide ${variant === "danger" ? "border-red-300 text-red-300" : ""}`}
        >
          {text} <Info className="ml-1 w-3" />
        </Button>
      </div>
    </Popover>
  );
}
