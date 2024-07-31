import { TipperScoreInfo } from "@components/tips/TipperScoreInfo";
import { LabelValue } from "@components/ui/LabelValue";
import { Popover } from "@components/ui/Popover";
import Spinner from "@components/ui/Spinner";
import { useUser } from "@lib/context/UserContext";
import { HelpCircle } from "lucide-react";
import numeral from "numeral";

export function TipperScore() {
  const { user, userLoading } = useUser();
  return user || userLoading ? (
    <LabelValue
      className="text-xl mb-4"
      label={"Tipper Score"}
      value={
        <Popover content={<TipperScoreInfo />}>
          <div className="flex group">
            {userLoading ? (
              <Spinner size="xs" className="mr-1" />
            ) : (
              numeral(user?.tipperScore).format("0,0.[00]")
            )}
            <HelpCircle className="ml-1 size-4 group-hover:text-white" />
          </div>
        </Popover>
      }
    />
  ) : null;
}
