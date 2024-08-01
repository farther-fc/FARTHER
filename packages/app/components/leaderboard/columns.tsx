"use client";

import { TipperScoreInfo } from "@components/tips/TipperScoreInfo";
import { Avatar, AvatarFallback, AvatarImage } from "@components/ui/Avatar"; // Adjust the import path if needed
import { Button } from "@components/ui/Button";
import { Popover } from "@components/ui/Popover";
import { Skeleton } from "@components/ui/Skeleton";
import { LeaderboardRow } from "@lib/types/apiTypes";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, HelpCircle } from "lucide-react";
import Link from "next/link";
import numeral from "numeral";

export const columns: ColumnDef<LeaderboardRow>[] = [
  {
    accessorKey: "rank",
    header: "",
  },
  {
    accessorKey: "username",
    header: "User",
    cell: ({ row }) => {
      const { pfpUrl, username } = row.original;
      return (
        <Link
          href={`https://warpcast.com/${username}`}
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
    accessorKey: "tipperScore",
    header: ({ column }) => (
      <ColumnHeaderButton
        buttonText={
          <>
            Tipper
            <br />
            Score
          </>
        }
        description={<TipperScoreInfo />}
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      />
    ),
    cell: ({ row }) => (
      <span>{numeral(row.original.tipperScore).format("0,0.[00]")}</span>
    ),
  },
  // {
  //   accessorKey: "tipperRewards",
  //   header: ({ column }) => (
  //     <ColumnHeaderButton
  //       buttonText={
  //         <>
  //           Pending
  //           <br />
  //           Rewards
  //         </>
  //       }
  //       description={`Pending rewards based on the tipper score. The current rewards pool is ${numeral(TIPPER_REWARDS_POOL).format("0,0a")} $farther, which is distributed pro rata at the end of the month.`}
  //       onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
  //     />
  //   ),

  //   cell: ({ row }) => (
  //     <span>{numeral(row.original.tipperRewards).format("0,0")} ✨</span>
  //   ),
  // },
  {
    accessorKey: "seasonGivenAmount",
    header: ({ column }) => (
      <ColumnHeaderButton
        buttonText={
          <>
            Amount
            <br />
            Given
          </>
        }
        description="Total amount of tips given this season"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      />
    ),
    cell: ({ row }) => (
      <span>{row.original.seasonGivenAmount.toLocaleString()} ✨</span>
    ),
  },
  {
    accessorKey: "seasonGivenCount",
    header: ({ column }) => (
      <ColumnHeaderButton
        buttonText={
          <>
            Count
            <br />
            Given
          </>
        }
        description="Total number of tips given this season"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      />
    ),
    cell: ({ row }) => (
      <span>{row.original.seasonGivenCount.toLocaleString()}</span>
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
