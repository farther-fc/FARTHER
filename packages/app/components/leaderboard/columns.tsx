"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@components/ui/Avatar"; // Adjust the import path if needed
import { Button } from "@components/ui/Button";
import Link from "next/link";

export type Leaderboard = {
  fid: number;
  displayName: string;
  pfpUrl: string;
  username: string;
  powerBadge: boolean;
  currentAllowance: number;
  totalAllowance: number;
  totalGivenCount: number;
  totalGivenAmount: number;
};

export const columns: ColumnDef<Leaderboard>[] = [
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
          <Avatar className="h-8 w-8">
            <AvatarImage src={pfpUrl} alt={username} />
            <AvatarFallback>{username[0]}</AvatarFallback>
          </Avatar>
          <span>{username}</span>
        </Link>
      );
    },
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
        <ArrowUpDown className="ml-2 h-4 w-4" />
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
        <ArrowUpDown className="ml-2 h-4 w-4" />
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
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
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
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
];
