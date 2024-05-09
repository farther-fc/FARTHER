import { Checkbox } from "@components/ui/Checkbox";
import { Input } from "@components/ui/Input";
import {
  EVANGELIST_FOLLOWER_MINIMUM,
  TWEET_BASE_TOKENS,
  TWEET_FARTHER_BONUS_MULTIPLIER,
} from "@farther/common";
import { cn } from "@lib/utils";
import { useToast } from "hooks/useToast";
import numeral from "numeral";
import React from "react";
import { getEvanglistAllocationBonus } from "server/evangelize/getEvangelistAllocation";

const Cell = ({
  children,
  className = "",
}: {
  children?: React.ReactNode;
  className?: string;
}) => (
  <div className={cn("bg-background flex min-h-14 items-center", className)}>
    {children}
  </div>
);

export function TweetRewardTable() {
  const [followerCount, setFollowerCount] = React.useState(
    EVANGELIST_FOLLOWER_MINIMUM,
  );
  const { toast } = useToast();
  const [hasFartherBonus, setHasFartherBonus] = React.useState(true);
  const followerBonus = getEvanglistAllocationBonus({
    followerCount,
    baseTokensPerTweet: TWEET_BASE_TOKENS,
  });

  let total = TWEET_BASE_TOKENS + followerBonus;

  if (hasFartherBonus) {
    total = total * TWEET_FARTHER_BONUS_MULTIPLIER;
  }

  return (
    <div className="max-w-[500px] ">
      <div className="bg-muted m-2 mt-6 grid grid-cols-[1.5fr_1.5fr_0.8fr] gap-y-px">
        <Cell>Base reward:</Cell>
        <Cell />
        <Cell className="justify-end">
          {numeral(TWEET_BASE_TOKENS).format("0,0")}
        </Cell>
        <Cell>Follower bonus:</Cell>
        <Cell className="relative ml-auto w-full">
          <div className="ml-auto flex flex-col">
            <span className="text-left text-xs">Twitter Followers</span>
            <Input
              min={80}
              className="inline-block h-6 w-[95px] pr-0 text-right"
              type="number"
              value={followerCount}
              onChange={(e) => {
                const newVal = Number(e.target.value);
                if (newVal === EVANGELIST_FOLLOWER_MINIMUM) {
                  toast({
                    msg: `You must have at least ${EVANGELIST_FOLLOWER_MINIMUM} Twitter followers to earn rewards.`,
                  });
                }
                setFollowerCount(newVal);
              }}
            />{" "}
          </div>
        </Cell>
        <Cell className="justify-end">{followerBonus}</Cell>
        <Cell>$FARTHER bonus*:</Cell>
        <Cell>
          <Checkbox
            className="ml-auto mt-[3px]"
            checked={hasFartherBonus}
            onCheckedChange={(e) =>
              setHasFartherBonus(e !== "indeterminate" && !!e)
            }
          />
        </Cell>
        <Cell
          className={`justify-end ${hasFartherBonus ? "text-white" : "text-muted"}`}
        >
          x {TWEET_FARTHER_BONUS_MULTIPLIER}
        </Cell>
        <Cell className={cn("font-bold")}>TOTAL</Cell>
        <Cell className="col-span-2 justify-end text-right font-bold">
          {numeral(total).format("0,0")} FARTHER
        </Cell>
      </div>
      <p className="text-right text-xs">
        The above values will be adjusted periodically based on participation.
      </p>
      <p className="text-right text-xs">*Tweet includes "$FARTHER"</p>
    </div>
  );
}
