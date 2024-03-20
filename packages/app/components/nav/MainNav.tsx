import { ROUTES } from "@lib/config";
import { useMediaQuery } from "@lib/context/MediaQueryContext";
import { cn } from "@lib/utils";
import Link from "next/link";
import * as React from "react";

const linkStyles = cn(
  "text-muted-foreground flex items-center text-sm font-medium",
);

export function MainNav() {
  const { isTabletSm } = useMediaQuery();

  return (
    <div className="flex w-full gap-6 md:gap-10">
      <Link href="/" className="flex items-center ">
        F A R T H E R
      </Link>
      <nav className="ml-auto flex gap-6">
        {isTabletSm &&
          Object.values(ROUTES).map(({ title, path }) => (
            <Link key={path} href={path} className={linkStyles}>
              {title}
            </Link>
          ))}
      </nav>
    </div>
  );
}
