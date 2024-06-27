import { Button } from "@components/ui/Button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@components/ui/DropdownMenu";
import { ExternalLink } from "@components/ui/ExternalLink";
import { FARTHER_CHANNEL_URL, ROUTES, clickIds } from "@lib/constants";
import { useUser } from "@lib/context/UserContext";
import { cn } from "@lib/utils";
import { Menu } from "lucide-react";
import Link from "next/link";

const headingStyles =
  "border border-x-0 border-b-0 pt-3 border-ghost text-right uppercase font-normal text-muted text-xs mt-0 mb-2";

function closeMenu() {
  document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
}

export function NavMenu() {
  const { accountAddress } = useUser();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          sentryId={clickIds.openHeaderNavMenu}
          variant="ghost"
          className="px-2"
        >
          <Menu />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="flex w-40 flex-col px-4 pt-4 text-lg"
        align="end"
      >
        {!!accountAddress && (
          <h4 className={cn(headingStyles, "border-none pt-0")}>User</h4>
        )}
        {Object.entries(ROUTES)
          .filter(([id]) => !!accountAddress && id === "profile")
          .map(([_id, route]) => (
            <Link href={route.path} legacyBehavior key={route.path}>
              <a onClick={closeMenu} className="mb-4 text-right">
                {route.title}
              </a>
            </Link>
          ))}
        <h4
          className={cn(
            headingStyles,
            !accountAddress ? "border-none pt-0 font-normal" : "",
          )}
        >
          Features
        </h4>
        {Object.entries(ROUTES)
          .filter(([, { type }]) => type === "feature")
          .map(([_id, route]) => (
            <Link href={route.path} legacyBehavior key={route.path}>
              <a onClick={closeMenu} className="mb-3 text-right">
                {route.title}
              </a>
            </Link>
          ))}
        <h4 className={headingStyles}>About</h4>
        {Object.entries(ROUTES)
          .filter(([_, { type }]) => type === "info")
          .map(([_id, route]) => (
            <Link href={route.path} legacyBehavior key={route.path}>
              <a onClick={closeMenu} className="mb-3 text-right">
                {route.title}
              </a>
            </Link>
          ))}
        <ExternalLink href={FARTHER_CHANNEL_URL} className="mb-3 text-right">
          Community
        </ExternalLink>
        <h4 className={headingStyles}>Developers</h4>
        {Object.entries(ROUTES)
          .filter(([_, { type }]) => type === "dev")
          .map(([_id, route]) => (
            <Link href={route.path} legacyBehavior key={route.path}>
              <a onClick={closeMenu} className="mb-3 text-right">
                {route.title}
              </a>
            </Link>
          ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
