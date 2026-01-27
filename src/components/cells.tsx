import { useNavigate } from "@tanstack/react-router";
import { BracesIcon } from "lucide-react";
import * as React from "react";

export function Cell({ children }: { children: React.ReactNode }) {
  return (
    <div className="line-clamp-2">
      <div className="text-left" dir="auto">
        <div>
          <span className="block">{children}</span>
        </div>
      </div>
    </div>
  );
}

interface JSONCellProps {
  id: number;
  children: React.ReactNode;
}

export function JSONCell({ id, children }: JSONCellProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate({
      to: ".",
      search: (prev) => ({ ...prev, json_viewer: id }),
    });
  };

  return (
    <div className="line-clamp-2">
      <div className="text-left" dir="auto">
        <div>
          <button
            data-json-id={id}
            onClick={handleClick}
            className="float-right mt-1 mr-0.5 ml-2 flex items-center justify-center rounded-full bg-white p-1.5 text-gray-700 ring-1 ring-gray-300 transition hover:bg-gray-50 hover:text-gray-900 hover:shadow-sm dark:bg-gray-800 dark:text-gray-100 dark:ring-gray-600 dark:hover:bg-gray-700 dark:hover:text-white"
          >
            <BracesIcon className="size-3" />
          </button>
          <span className="block">{children}</span>
        </div>
      </div>
    </div>
  );
}
