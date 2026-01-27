"use client";

import { Toaster as Sonner } from "sonner";

export function Toaster() {
  return (
    <Sonner
      position="bottom-right"
      expand={false}
      richColors={false}
      closeButton
      duration={4000}
      offset={24}
      gap={8}
      toastOptions={{
        classNames: {
          toast: "!shadow-none",
          error: "!bg-black !text-red-500 !border-gray-500/20 !shadow-none",
        },
      }}
    />
  );
}
