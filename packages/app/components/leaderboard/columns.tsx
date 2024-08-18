"use client";

import { TipperScoreInfo } from "@components/tips/TipperScoreInfo";
import { Avatar, AvatarFallback, AvatarImage } from "@components/ui/Avatar"; // Adjust the import path if needed
import { Button } from "@components/ui/Button";
import { ExternalLink } from "@components/ui/ExternalLink";
import { Popover } from "@components/ui/Popover";
import { Skeleton } from "@components/ui/Skeleton";
import { TIPPER_REWARDS_POOL } from "@farther/common";
import { OPENRANK_DOCS_URL } from "@lib/constants";
import { LeaderboardRow } from "@lib/types/apiTypes";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, HelpCircle } from "lucide-react";
import Link from "next/link";
import numeral from "numeral";

export const columns: ColumnDef<LeaderboardRow>[] = [
  {
    accessorKey: "username",
    header: "",
    cell: ({ row }) => {
      const { pfpUrl, username, fid } = row.original;
      return (
        <Link
          href={`https://warpcast.com/~/profiles/${fid}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center space-x-2"
        >
          <Avatar className="size-5">
            <AvatarImage
              src={`https://res.cloudinary.com/merkle-manufactory/image/fetch/c_fill,f_png,h_30,w_30/${pfpUrl}`}
              alt={username || ""}
            />
            <AvatarFallback>
              <Skeleton className="rounded-full" />
            </AvatarFallback>
          </Avatar>
          <span>{username}</span>
        </Link>
      );
    },
  },
  {
    accessorKey: "rank",
    header: ({ column }) => {
      return (
        <ColumnHeaderButton
          buttonText={
            <>
              Tipper
              <br />
              Rank
            </>
          }
          description={<TipperScoreInfo />}
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        />
      );
    },
    cell: ({ row }) => (
      <span className="font-bold">
        {numeral(row.original.rank).format("0,0")}
      </span>
    ),
  },
  {
    accessorKey: "potentialTipperRewards",
    header: ({ column }) => (
      <ColumnHeaderButton
        buttonText={
          <>
            Potential
            <br />
            Rewards
          </>
        }
        description={
          <>
            <p>
              Potential rewards based on the current tipper scores. The rewards
              pool is currently ${numeral(TIPPER_REWARDS_POOL).format("0,0a")}{" "}
              $farther, which is distributed pro rata at the end of the month.{" "}
            </p>
            <p>
              <strong>
                The tippper rewards system is in a very nascent, experimental
                phase which occassionally requires changes to the parameters.
                Potential rewards are not guaranteed.{" "}
              </strong>
            </p>
          </>
        }
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      />
    ),

    cell: ({ row }) => (
      <span>
        {numeral(row.original.potentialTipperRewards).format("0,0")} ✨
      </span>
    ),
  },
  {
    accessorKey: "currentAllowance",
    header: ({ column }) => (
      <ColumnHeaderButton
        buttonText={
          <>
            Current
            <br />
            Allowance
          </>
        }
        description={
          <>
            <p>
              Each tipper's allowance is calculated by weighing their{" "}
              <ExternalLink href={OPENRANK_DOCS_URL}>
                OpenRank following rank
              </ExternalLink>{" "}
              in addition to how widely they distribute to unique users.
            </p>
            <p>
              An amount of zero indicates this user is currently not eligible to
              receive an allowance.
            </p>
          </>
        }
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      />
    ),
    cell: ({ row }) => (
      <span>{row.original.currentAllowance.toLocaleString()} ✨</span>
    ),
  },

  {
    accessorKey: "orFollowingRank",
    header: ({ column }) => (
      <ColumnHeaderButton
        buttonText={
          <>
            Following
            <br />
            Rank
          </>
        }
        description={
          <>
            This is the tipper's current{" "}
            <ExternalLink href={OPENRANK_DOCS_URL}>
              OpenRank Following Rank
            </ExternalLink>
            , which is used as a weight in the allowance calculation.
          </>
        }
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      />
    ),
    cell: ({ row }) => (
      <span>
        {row.original.orFollowingRank
          ? row.original.orFollowingRank.toLocaleString()
          : "_"}
      </span>
    ),
  },
  {
    accessorKey: "breadthRatio",
    header: ({ column }) => (
      <ColumnHeaderButton
        buttonText={
          <>
            Breadth
            <br />
            Ratio
          </>
        }
        description={
          <>
            <p>
              This is how widely the tipper distributes their tips to unique
              users. 100% means they've tipped a different user for every tip,
              and they spread their allowance as widely as possible (tip minimum
              every time).{" "}
            </p>
            <p>
              This is used as a weight in the allowance calculation (to mitigate
              coordinate tip trading), however it is not recommnded tippers aim
              for 100%. A healthy breadth ratio is 50-70%.{" "}
            </p>
          </>
        }
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      />
    ),
    cell: ({ row }) => (
      <span>{numeral(row.original.breadthRatio * 100).format("0.0")}%</span>
    ),
  },
  {
    accessorKey: "totalGivenAmount",
    header: ({ column }) => (
      <ColumnHeaderButton
        buttonText={
          <>
            Lifetime
            <br />
            Tipped
          </>
        }
        description="Total amount of $farther this tipper has given other users."
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      />
    ),
    cell: ({ row }) => (
      <span>{row.original.totalGivenAmount.toLocaleString()} ✨</span>
    ),
  },
];

function ColumnHeaderButton({
  onClick,
  description,
  buttonText,
}: {
  onClick: () => void;
  description: React.ReactNode;
  buttonText: React.ReactNode;
}) {
  return (
    <div className="flex justify-end">
      <Popover content={description}>
        <HelpCircle className="mr-0 mt-3 size-4 text-ghost" />
      </Popover>
      <Button
        variant="ghost"
        className="h-auto backdrop-blur-none pl-2 pr-1 hover:bg-transparent"
        onClick={onClick}
      >
        {buttonText}
        <ArrowUpDown className="ml-1 size-4" />
      </Button>
    </div>
  );
}
