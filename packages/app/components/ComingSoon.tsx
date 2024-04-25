import React from "react";

function ComingSoon({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-[calc(100vh-300px)] items-center justify-center text-center">
      <div>{children}</div>
    </div>
  );
}

export default ComingSoon;
