"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@components/ui/Avatar"; // Adjust the import path if needed
import { Button } from "@components/ui/Button";
import { LeaderboardRow } from "@lib/types/apiTypes";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import Link from "next/link";

export const columns: ColumnDef<LeaderboardRow>[] = [
  {
    accessorKey: "username",
    header: "Username",
    cell: ({ row }) => {
      const { pfpUrl, username } = row.original;
      return (
        <Link
          href={`https://warpcast.com/${username}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center space-x-2"
        >
          <Avatar className="size-8">
            <AvatarImage src={pfpUrl} alt={username} />
            <AvatarFallback>{username[0]}</AvatarFallback>
          </Avatar>
          <span>{username}</span>
        </Link>
      );
    },
  },
  {
    accessorKey: "totalGivenAmount",
    header: ({ column }) => (
      <Button
        sentryId="leaderboard_total_given_amount_sorting"
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Total Amount Given
        <ArrowUpDown className="ml-2 size-4" />
      </Button>
    ),
  },
  {
    accessorKey: "totalGivenCount",
    header: ({ column }) => (
      <Button
        sentryId="leaderboard_total_given_count_sorting"
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Total Tips Given
        <ArrowUpDown className="ml-2 size-4" />
      </Button>
    ),
  },

  {
    accessorKey: "totalAllowance",
    header: ({ column }) => (
      <Button
        sentryId="leaderboard_total_allowance_sorting"
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Total Allowance
        <ArrowUpDown className="ml-2 size-4" />
      </Button>
    ),
  },
  {
    accessorKey: "currentAllowance",
    header: ({ column }) => (
      <Button
        sentryId="leaderboard_current_allowance_sorting"
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Current Allowance
        <ArrowUpDown className="ml-2 size-4" />
      </Button>
    ),
  },
];
