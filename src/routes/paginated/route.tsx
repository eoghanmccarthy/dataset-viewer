import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type ColumnResizeMode,
  type ColumnResizeDirection,
  useReactTable,
} from "@tanstack/react-table";
import { zodValidator } from "@tanstack/zod-adapter";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import * as React from "react";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { makeData, type Person } from "@/utils.ts";

import { Cell, JSONCell } from "../../components/cells.tsx";
import { JSONViewerOverlay } from "../../components/json-viewer-overlay.tsx";

const PAGE_SIZE = 100;

const datasetViewerSearchSchema = z.object({
  p: z.number().optional().default(0),
  json_viewer: z.number().optional(),
});

// type DatasetViewerSearch = z.infer<typeof datasetViewerSearchSchema>

export const Route = createFileRoute("/paginated")({
  component: RouteComponent,
  validateSearch: zodValidator(datasetViewerSearchSchema),
});

export function RouteComponent() {
  const { p: page, json_viewer } = Route.useSearch();
  const navigate = useNavigate();

  const [data, setData] = React.useState(() => makeData(500));

  const refreshData = React.useCallback(() => {
    setData(makeData(500));
  }, []);

  const [columnResizeMode] = React.useState<ColumnResizeMode>("onChange");
  const [columnResizeDirection] = React.useState<ColumnResizeDirection>("ltr");

  const columns = React.useMemo<ColumnDef<Person>[]>(
    () => [
      {
        accessorKey: "id",
        size: 180,
        cell: (info) => {
          return <Cell>{info.getValue() as string}</Cell>;
        },
      },
      {
        accessorKey: "translated_text",
        size: 240,
        cell: (info) => {
          const id = info.row.index * table.getAllColumns().length + info.column.getIndex();
          return <JSONCell id={id}>{info.getValue() as string}</JSONCell>;
        },
      },
      {
        accessorKey: "translated_chunks",
        size: 240,
        cell: (info) => {
          const id = info.row.index * table.getAllColumns().length + info.column.getIndex();
          return <JSONCell id={id}>{info.getValue() as string}</JSONCell>;
        },
      },
      // {
      //   accessorKey: 'og_chunks',
      //   size: 50
      // },
      // {
      //   accessorKey: 'og_full_text',
      //   size: 50
      // },
      {
        accessorKey: "og_language_score",
        cell: (info) => info.getValue(),
      },
    ],
    [],
  );

  const table = useReactTable({
    data,
    columns,
    columnResizeMode,
    columnResizeDirection,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      pagination: {
        pageIndex: page,
        pageSize: PAGE_SIZE,
      },
    },
  });

  const numCols = table.getAllColumns().length;
  const totalPages = table.getPageCount();

  const selected = React.useMemo(() => {
    if (json_viewer == null) return null;
    return {
      row: Math.floor(json_viewer / numCols),
      col: json_viewer % numCols,
    };
  }, [numCols, json_viewer]);

  const { rows } = table.getRowModel();

  const goToPage = (newPage: number) => {
    navigate({
      to: ".",
      search: (prev) => ({ ...prev, p: newPage }),
    });
  };

  // Generate page numbers for pagination UI
  const getPageNumbers = () => {
    const pages: (number | "ellipsis")[] = [];
    if (totalPages <= 5) {
      for (let i = 0; i < totalPages; i++) pages.push(i);
    } else {
      pages.push(0);
      if (page > 2) pages.push("ellipsis");
      for (let i = Math.max(1, page - 1); i <= Math.min(totalPages - 2, page + 1); i++) {
        pages.push(i);
      }
      if (page < totalPages - 3) pages.push("ellipsis");
      pages.push(totalPages - 1);
    }
    return pages;
  };

  return (
    <div>
      {selected !== null && <JSONViewerOverlay data={data} selectedIndex={selected.row} numCols={numCols} />}
      <div className="mx-auto text-center">
        <div className="mb-8 flex items-center justify-center gap-4">
          ({data.length} rows)
          <Button onClick={refreshData}>Refresh Data</Button>
        </div>
        <div className="mx-auto mb-10 flex flex-col overflow-hidden rounded-lg border border-gray-200 px-2.5 pt-2 shadow-xs">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <div className="mr-auto flex items-center">
              <div className="font-semibold whitespace-nowrap">Dataset Viewer</div>
            </div>
          </div>
          <div className="-mx-2.5 flex flex-1 flex-col overflow-hidden border-t border-gray-200">
            <div className="relative max-h-96 w-full overflow-auto" style={{
              height: "800px", //should be a fixed height
            }}>
              <table
                className="text-gray-90 w-full table-auto rounded-lg font-mono text-xs"
                style={{ display: "grid", tableLayout: "fixed", borderCollapse: "collapse" }}
              >
                <thead
                  className="sticky top-0 right-0 left-0 z-20 bg-white align-top shadow-xs"
                  style={{
                    display: "grid",
                    zIndex: 1,
                  }}
                >
                  {table.getHeaderGroups().map((headerGroup) => {
                    return (
                      <tr
                        key={headerGroup.id}
                        className="h-full min-w-fit border-b border-gray-200 text-left"
                        style={{ display: "flex", width: "100%" }}
                      >
                        {headerGroup.headers.map((header) => {
                          return (
                            <th
                              key={header.id}
                              className="relative h-full shrink-0 overflow-hidden p-2 text-left"
                              style={{
                                display: "flex",
                                width: header.getSize(),
                              }}
                            >
                              <div
                                {...{
                                  className: header.column.getCanSort()
                                    ? "cursor-pointer select-none"
                                    : "",
                                  onClick: header.column.getToggleSortingHandler(),
                                }}
                              >
                                {flexRender(header.column.columnDef.header, header.getContext())}
                                {{
                                  asc: " 🔼",
                                  desc: " 🔽",
                                }[header.column.getIsSorted() as string] ?? null}
                              </div>
                              <div
                                className="absolute right-0 top-0 h-full w-1 cursor-col-resize select-none touch-none hover:bg-indigo-100 active:bg-indigo-500 dark:hover:bg-indigo-800 dark:active:bg-indigo-600/80"
                                onDoubleClick={() => header.column.resetSize()}
                                onMouseDown={header.getResizeHandler()}
                                onTouchStart={header.getResizeHandler()}
                              />
                            </th>
                          );
                        })}
                      </tr>
                    );
                  })}
                </thead>
                <tbody style={{ display: "grid" }}>
                  {rows.map((row) => {
                    return (
                      <tr
                        key={row.id}
                        className="dark:odd:bg-gray-925 dark:hover:bg-gray-850 group flex w-full cursor-pointer border-b border-gray-200 outline-offset-[-2px] last:border-none odd:bg-gray-50 hover:bg-gray-100"
                      >
                        {row.getVisibleCells().map((cell) => {
                          return (
                            <td
                              key={cell.id}
                              className="group relative shrink-0 overflow-hidden border-r border-gray-200 p-2 break-words last:border-none"
                              style={{
                                display: "flex",
                                width: cell.column.getSize(),
                              }}
                            >
                              {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          <div className="-mx-2.5 bg-linear-to-b from-gray-100 to-white dark:from-gray-950 dark:to-gray-900">
            <hr className="-translate-y-px flex-none border-t border-dashed border-gray-300 bg-white dark:border-gray-700 dark:bg-gray-950" />
            <nav>
              <ul className="flex select-none items-center justify-between space-x-2 rounded-b-lg py-1 text-center font-mono text-xs text-gray-700 sm:justify-center">
                <li>
                  <button
                    onClick={() => goToPage(page - 1)}
                    disabled={!table.getCanPreviousPage()}
                    className={`flex items-center rounded-lg px-2.5 py-1 hover:bg-gray-50 dark:hover:bg-gray-800 ${
                      !table.getCanPreviousPage() ? "pointer-events-none cursor-default text-gray-400" : ""
                    }`}
                  >
                    <ChevronLeftIcon className="mr-1.5 size-4" />
                    Previous
                  </button>
                </li>

                {getPageNumbers().map((pageNum, idx) =>
                  pageNum === "ellipsis" ? (
                    <li key={`ellipsis-${idx}`} className="hidden sm:block">
                      <span className="pointer-events-none cursor-default rounded-lg px-2.5 py-1">...</span>
                    </li>
                  ) : (
                    <li key={pageNum} className="hidden sm:block">
                      <button
                        onClick={() => goToPage(pageNum)}
                        className={`rounded-lg px-2.5 py-1 hover:bg-gray-50 dark:hover:bg-gray-800 ${
                          pageNum === page
                            ? "bg-gray-50 font-semibold ring-1 ring-inset ring-gray-200 dark:bg-gray-900 dark:text-yellow-500 dark:ring-gray-900"
                            : ""
                        }`}
                      >
                        {pageNum + 1}
                      </button>
                    </li>
                  ),
                )}

                <li>
                  <button
                    onClick={() => goToPage(page + 1)}
                    disabled={!table.getCanNextPage()}
                    className={`flex items-center rounded-lg px-2.5 py-1 hover:bg-gray-50 dark:hover:bg-gray-800 ${
                      !table.getCanNextPage() ? "pointer-events-none cursor-default text-gray-400" : ""
                    }`}
                  >
                    Next
                    <ChevronRightIcon className="ml-1.5 size-4" />
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
}
