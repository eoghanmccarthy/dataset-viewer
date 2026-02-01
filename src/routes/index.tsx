import { createFileRoute } from "@tanstack/react-router";
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  type Row,
  useReactTable,
} from "@tanstack/react-table";
import { useVirtualizer } from "@tanstack/react-virtual";
import { zodValidator } from "@tanstack/zod-adapter";
import * as React from "react";
import { z } from "zod";

import { Button } from "@/components/ui/button.tsx";

import { Cell, JSONCell } from "../components/cells.tsx";
import { makeData, type Data } from "../utils.ts";

const datasetViewerSearchSchema = z.object({
  json_viewer: z.number().optional(),
});

// type DatasetViewerSearch = z.infer<typeof datasetViewerSearchSchema>

export const Route = createFileRoute("/")({
  component: RouteComponent,
  validateSearch: zodValidator(datasetViewerSearchSchema),
});

export function RouteComponent() {
  const columns = React.useMemo<ColumnDef<Data>[]>(
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

  // The virtualizer needs a reference to the scrollable container element
  const tableContainerRef = React.useRef<HTMLDivElement>(null);

  const [data, setData] = React.useState(() => makeData(1_000));

  const refreshData = React.useCallback(() => {
    setData(makeData(1_000));
  }, []);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    debugTable: true,
  });

  const { rows } = table.getRowModel();

  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    estimateSize: () => 33, //estimate row height for accurate scrollbar dragging
    getScrollElement: () => tableContainerRef.current,
    //measure dynamic row height, except in firefox because it measures table border height incorrectly
    measureElement:
      typeof window !== "undefined" && navigator.userAgent.indexOf("Firefox") === -1
        ? (element) => element?.getBoundingClientRect().height
        : undefined,
    overscan: 5,
  });

  // All important CSS styles are included as inline styles for this example. This is not recommended for your code.
  return (
    <div>
      <div className="mx-auto text-center">
        <div className="mb-8 flex items-center justify-center gap-4">
          ({data.length} rows)
          <Button onClick={refreshData}>Refresh Data</Button>
        </div>
        <section className="pt-3">
          <div className="mx-auto mb-10 flex flex-col overflow-hidden rounded-lg border border-gray-200 px-2.5 pt-2 shadow-xs">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <div className="mr-auto flex items-center">
                <div className="font-semibold whitespace-nowrap">Dataset Viewer</div>
              </div>
            </div>
            <div className="-mx-2.5 flex flex-1 flex-col overflow-hidden border-t border-gray-200">
              <div
                className="relative max-h-96 w-full overflow-auto"
                ref={tableContainerRef}
                style={{
                  height: "800px", //should be a fixed height
                }}
              >
                {/* Even though we're still using sematic table tags, we must use CSS grid and flexbox for dynamic row heights */}
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
                              </th>
                            );
                          })}
                        </tr>
                      );
                    })}
                  </thead>
                  <tbody
                    style={{
                      display: "grid",
                      height: `${rowVirtualizer.getTotalSize()}px`, //tells scrollbar how big the table is
                      position: "relative", //needed for absolute positioning of rows
                    }}
                  >
                    {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                      const row = rows[virtualRow.index] as Row<Data>;
                      return (
                        <tr
                          data-index={virtualRow.index} //needed for dynamic row height measurement
                          ref={rowVirtualizer.measureElement} //measure dynamic row height
                          key={row.id}
                          className="dark:odd:bg-gray-925 dark:hover:bg-gray-850 group absolute flex w-full cursor-pointer border-b border-gray-200 outline-offset-[-2px] last:border-none odd:bg-gray-50 hover:bg-gray-100"
                          style={{
                            transform: `translateY(${virtualRow.start}px)`, //this should always be a `style` as it changes on scroll
                          }}
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
          </div>
        </section>
      </div>
    </div>
  );
}
