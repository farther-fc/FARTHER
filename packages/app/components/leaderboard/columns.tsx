"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@components/ui/Avatar"; // Adjust the import path if needed
import { Button } from "@components/ui/Button";
import { LeaderboardRow } from "@lib/types/apiTypes";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import Link from "next/link";

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
          <Avatar className="size-8">
            <AvatarImage src={pfpUrl} alt={username} />
            <AvatarFallback>{username || ""}</AvatarFallback>
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
        variant="ghost"
        className="h-auto backdrop-blur-none"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Total Amount Given
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
        className="h-auto backdrop-blur-none"
      >
        Total Tips Given
        <ArrowUpDown className="ml-2 size-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <span>{row.original.totalGivenCount.toLocaleString()}</span>
    ),
  },
  {
    accessorKey: "currentAllowance",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="h-auto backdrop-blur-none"
      >
        Current Allowance
        <ArrowUpDown className="ml-2 size-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <span>{row.original.currentAllowance.toLocaleString()} ✨</span>
    ),
  },
];
