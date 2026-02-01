import { useNavigate } from "@tanstack/react-router";
import { BracesIcon, ChevronLeftIcon, ChevronRightIcon, CopyIcon, XIcon } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";

import type { Data } from "../utils.ts";

interface JSONViewerOverlayProps {
  data: Data[];
  selectedIndex: number;
  numCols: number;
}

export function JSONViewerOverlay({ data, selectedIndex, numCols }: JSONViewerOverlayProps) {
  const navigate = useNavigate();
  const currentRow = data[selectedIndex];

  const handleClose = () => {
    navigate({
      to: ".",
      search: (prev) => {
        const { json_viewer: _, ...rest } = prev as Record<string, unknown>;
        return rest;
      },
    });
  };

  const handlePrev = () => {
    if (selectedIndex > 0) {
      navigate({
        to: ".",
        search: (prev) => ({ ...prev, json_viewer: (selectedIndex - 1) * numCols }),
      });
    }
  };

  const handleNext = () => {
    if (selectedIndex < data.length - 1) {
      navigate({
        to: ".",
        search: (prev) => ({ ...prev, json_viewer: (selectedIndex + 1) * numCols }),
      });
    }
  };

  const handleCopyJSON = async () => {
    if (currentRow) {
      await navigator.clipboard.writeText(JSON.stringify(currentRow, null, 2));
    }
  };

  // Handle keyboard navigation
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleClose();
      } else if (e.key === "ArrowLeft") {
        handlePrev();
      } else if (e.key === "ArrowRight") {
        handleNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedIndex]);

  if (!currentRow) return null;

  const hasPrev = selectedIndex > 0;
  const hasNext = selectedIndex < data.length - 1;

  return (
    <div className="fixed inset-0 z-40 grid max-h-dvh grid-rows-1 place-items-center overscroll-contain bg-black/80 min-[1680px]:grid-cols-[200px_1fr_200px_400px] min-[1936px]:grid-cols-[250px_1fr_250px_400px] md:grid-cols-[150px_1fr_150px] lg:grid-cols-[150px_1fr_150px_400px] dark:bg-black/90">
      {/* Left navigation button */}
      <button
        onClick={handlePrev}
        className={`group grid size-[120px] place-items-center max-md:hidden ${!hasPrev ? "invisible" : ""}`}
      >
        <div className="flex items-center justify-center rounded-xl border border-white/25 bg-white/20 p-1.5 text-xl text-white group-hover:shadow-inner group-hover:ring-3 sm:p-2">
          <ChevronLeftIcon className="size-6" />
        </div>
      </button>

      {/* Center content */}
      <div className="relative flex h-full w-full min-w-0 items-center">
        <div className="flex h-auto max-h-[calc(100vh-160px)] w-full items-center justify-center">
          <div
            id="json-viewer"
            className="relative flex h-auto max-h-[calc(100vh-240px)] w-full max-w-[800px] min-w-48 flex-col overflow-hidden rounded-xl bg-white text-gray-900 shadow-lg max-md:mx-6 md:max-h-[calc(100vh-160px)] dark:bg-gray-800 dark:text-white"
          >
            {/* Header */}
            <div className="sticky top-0 z-10 flex flex-none items-center justify-between rounded-t-xl bg-gray-100 px-4 py-2 shadow-sm dark:bg-gray-700">
              <div className="flex items-center">
                <BracesIcon className="mr-2 size-5" />
                <h2 className="text-lg font-semibold">JSON View</h2>
              </div>
            </div>

            {/* Content */}
            <div className="group relative h-[calc(100%-60px)] overflow-y-auto">
              <div className="pointer-events-none sticky top-2 z-10">
                <button
                  onClick={handleCopyJSON}
                  className="pointer-events-auto absolute top-0 right-2 rounded-md bg-white/80 p-2 text-sm text-gray-400 opacity-0 shadow-sm backdrop-blur-sm transition-opacity group-hover:opacity-100 hover:text-gray-600 dark:bg-gray-900/80 dark:hover:text-gray-200"
                  title="Copy JSON to clipboard"
                  type="button"
                >
                  <CopyIcon className="size-4" />
                </button>
              </div>
              <pre className="w-full overflow-auto bg-gray-50 p-4 text-xs dark:bg-gray-800">
                <code className="block w-full">{JSON.stringify(currentRow, null, 2)}</code>
              </pre>
            </div>
          </div>
        </div>

        {/* Mobile navigation controls */}
        <div className="absolute inset-x-0 bottom-6 flex items-center justify-center gap-4">
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={handlePrev}
              className={`group grid size-[50px] place-items-center md:hidden ${!hasPrev ? "invisible" : ""}`}
            >
              <div className="flex items-center justify-center rounded-xl border border-white/25 bg-white/20 p-1.5 text-xl text-white group-hover:shadow-inner group-hover:ring-3 sm:p-2">
                <ChevronLeftIcon className="size-5" />
              </div>
            </button>
            <button
              onClick={handleNext}
              className={`group grid size-[50px] place-items-center md:hidden ${!hasNext ? "invisible" : ""}`}
            >
              <div className="flex items-center justify-center rounded-xl border border-white/25 bg-white/20 p-1.5 text-xl text-white group-hover:shadow-inner group-hover:ring-3 sm:p-2">
                <ChevronRightIcon className="size-5" />
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Right navigation button */}
      <button
        onClick={handleNext}
        className={`group grid size-[120px] place-items-center max-md:hidden ${!hasNext ? "invisible" : ""}`}
      >
        <div className="flex items-center justify-center rounded-xl border border-white/25 bg-white/20 p-1.5 text-xl text-white group-hover:shadow-inner group-hover:ring-3 sm:p-2">
          <ChevronRightIcon className="size-6" />
        </div>
      </button>

      {/* Close button */}
      <Button
        onClick={handleClose}
        size="icon"
        className="absolute top-0 right-0 m-3 rounded-full border border-white/25 bg-white/20 text-gray-300 sm:m-6 lg:right-[400px]"
      >
        <XIcon className="size-4" />
      </Button>

      {/* Context panel */}
      <div className="size-[400px] h-full overflow-y-auto border-l border-black/50 bg-black/70 break-words max-lg:hidden dark:bg-black">
        <div className="p-8 font-mono text-xs">
          <div className="mb-2 text-white">#{selectedIndex + 1}</div>

          {Object.entries(currentRow).map(([key, value]) => (
            <React.Fragment key={key}>
              <h3 className="mb-1 text-gray-400">{key}</h3>
              <div className="mb-4 line-clamp-3 text-white *:*:text-left!">
                <div className="text-left" dir="auto">
                  {typeof value === "object" ? (
                    <span className="block min-h-[2rem]">{JSON.stringify(value, null, 2)}</span>
                  ) : (
                    <span className="block">{String(value)}</span>
                  )}
                </div>
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}
