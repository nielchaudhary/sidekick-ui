"use client";
import React from "react";

import { cn } from "@/lib/utils";

export function HoverBorderGradient({
  children,
  containerClassName,
  className,
  as: Tag = "button",
  ...props
}: React.PropsWithChildren<
  {
    as?: React.ElementType;
    containerClassName?: string;
    className?: string;
  } & React.HTMLAttributes<HTMLElement>
>) {
  return (
    <Tag
      className={cn(
        "group relative flex rounded-3xl content-center items-center flex-col flex-nowrap h-min justify-center overflow-visible p-px w-fit",
        containerClassName
      )}
      {...props}
    >
      <div className={cn("w-auto text-white z-10 bg-black px-4 py-2 rounded-[inherit]", className)}>
        {children}
      </div>
      <div
        className="flex-none inset-0 overflow-hidden absolute z-0 rounded-[inherit]"
        style={{
          filter: "blur(2px)",
          position: "absolute",
          width: "100%",
          height: "100%",
          background:
            "radial-gradient(75% 181.15942028985506% at 50% 50%, #3275F8 0%, rgba(255, 255, 255, 0) 100%)",
        }}
      />
      <div className="bg-black absolute z-1 flex-none inset-0.5 rounded-3xl" />
    </Tag>
  );
}
