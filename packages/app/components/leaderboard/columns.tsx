"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@components/ui/Avatar"; // Adjust the import path if needed
import { Button } from "@components/ui/Button";
import { Skeleton } from "@components/ui/Skeleton";
import { LeaderboardRow } from "@lib/types/apiTypes";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
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
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="h-auto backdrop-blur-none pl-4 pr-2"
      >
        Tipper <br />
        Score
        <ArrowUpDown className="ml-2 size-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <span>{numeral(row.original.tipperScore).format("0,0.[00]")}</span>
    ),
  },
  {
    accessorKey: "tipperRewards",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="h-auto backdrop-blur-none pl-4 pr-2"
      >
        Pending
        <br />
        Rewards
        <ArrowUpDown className="ml-2 size-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <span>{numeral(row.original.tipperRewards).format("0,0")} ✨</span>
    ),
  },
  {
    accessorKey: "totalGivenAmount",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="h-auto backdrop-blur-none pl-4 pr-2"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Amount
        <br />
        Given
        <ArrowUpDown className="ml-2 size-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <span>{row.original.totalGivenAmount.toLocaleString()} ✨</span>
    ),
  },
  {
    accessorKey: "totalGivenCount",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="h-auto backdrop-blur-none pl-4 pr-2"
      >
        Tips <br />
        Given
        <ArrowUpDown className="ml-2 size-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <span>{row.original.totalGivenCount.toLocaleString()}</span>
    ),
  },
];
