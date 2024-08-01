"use client";

import DoubleArrowLeftIcon from "@components/icons/DoubleArrowLeftIcon";
import DoubleArrowRightIcon from "@components/icons/DoubleArrowRightIcon";
import { columns } from "@components/leaderboard/columns";
import { Button } from "@components/ui/Button";
import { Skeleton } from "@components/ui/Skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@components/ui/Table";
import { trpcClient } from "@lib/trpcClient";
import { LeaderboardRow } from "@lib/types/apiTypes";
import {
  ColumnDef,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import React from "react";
import { DataTableToolbar } from "./LeaderboardToolbar";

const columnStyles: { [key: string]: string } = {
  rank: "w-[28px]",
  username: "w-[150px]",
  tipperScore: "text-right w-[150px]",
  // tipperRewards: "text-right w-[150px]",
  seasonGivenAmount: "text-right w-[150px]",
  seasonGivenCount: "text-right w-[150px]",
} as const;

export function Leaderboard() {
  const { data } = trpcClient.public.tips.leaderboard.useQuery();
  const [sorting, setSorting] = React.useState<SortingState>([
    { id: "tipperScore", desc: true },
  ]);

  const table = useReactTable({
    data: data ?? [],
    columns: columns as ColumnDef<LeaderboardRow>[],
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    enableColumnFilters: true,
  });

  return data ? (
    <div className="space-y-4 ">
      <DataTableToolbar table={table} />
      <div className="table-container overflow-auto rounded-xl border border-ghost lg:overflow-visible ">
        <Table className=" w-full table-fixed">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      colSpan={header.colSpan}
                      className={`bg-background-600 table-head h-auto lg:h-[60px] ${columnStyles[header.id] ?? ""}`}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="bg-background-600 hover:bg-background"
                >
                  {row.getVisibleCells().map((cell) => {
                    return (
                      <TableCell
                        key={cell.id}
                        className={`table-cell px-2 md:px-5 ${columnStyles[cell.column.id] ?? ""} ${cell.column.getIndex() === columns.length - 1 ? "pr-8 md:pr-10" : ""}`}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center px-2 justify-end">
        <div className="flex items-center space-x-6 lg:space-x-2">
          <div className="flex w-[100px] items-center justify-center text-sm font-medium">
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </div>
          <div className="flex items-center ml-1">
            <Button
              variant="ghost"
              className="hidden size-8 p-0 lg:flex"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">Go to first page</span>
              <DoubleArrowLeftIcon className="size-4" />
            </Button>
            <Button
              variant="ghost"
              className="size-8 p-0"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">Go to previous page</span>
              <ChevronLeftIcon className="size-4" />
            </Button>
            <Button
              variant="ghost"
              className="size-8 p-0"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">Go to next page</span>
              <ChevronRightIcon className="size-4" />
            </Button>
            <Button
              variant="ghost"
              className="hidden size-8 p-0 lg:flex"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">Go to last page</span>
              <DoubleArrowRightIcon className="size-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <Skeleton className="h-[600px]" />
  );
}
