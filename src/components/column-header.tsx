import { type Header } from "@tanstack/react-table";
import * as React from "react";

export function ColumnHeader<TData>({ header }: { header: Header<TData, any> }) {
  return (
    <>
      <div className="flex min-w-0 items-center justify-between">
        <span className="min-w-0 truncate" title={header.id}>
          {header.id}
        </span>
        <form className="flex flex-col">
          <button id="asc" className="-mr-1 ml-2 h-[0.4rem] w-[0.8rem] transition ease-in-out">
            <svg
              className="-rotate-180 transform text-gray-300 hover:text-gray-500"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 64 256 128"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M213.65674,101.657l-80,79.99976a7.99945,7.99945,0,0,1-11.31348,0l-80-79.99976A8,8,0,0,1,48,88H208a8,8,0,0,1,5.65674,13.657Z"></path>
            </svg>
          </button>
          <button id="desc" className="-mr-1 ml-2 h-[0.4rem] w-[0.8rem] transition ease-in-out">
            <svg
              className="text-gray-300 hover:text-gray-500"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 64 256 128"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M213.65674,101.657l-80,79.99976a7.99945,7.99945,0,0,1-11.31348,0l-80-79.99976A8,8,0,0,1,48,88H208a8,8,0,0,1,5.65674,13.657Z"></path>
            </svg>
          </button>
        </form>
      </div>
      <div className="mb-2 text-xs font-normal whitespace-nowrap text-gray-500">
        <span>list</span>
        <span className="text-gray-400 italic before:mx-1 before:content-['·']">lengths</span>
      </div>
    </>
  );
}
