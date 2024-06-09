import React from "react";

export function DataBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="border-ghost w-full justify-between rounded-xl border px-4 py-6">
      {children}
    </div>
  );
}
