import { Button } from "@components/ui/Button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@components/ui/DropdownMenu";
import { ExternalLink } from "@components/ui/ExternalLink";
import { clickIds } from "@lib/constants";
import { useUser } from "@lib/context/UserContext";
import { flatRoutes } from "@lib/routes";
import { cn } from "@lib/utils";
import { Menu } from "lucide-react";
import Link from "next/link";

const headingStyles =
  "border border-x-0 border-b-0 pt-3 border-ghost text-right uppercase font-normal text-muted text-xs mt-0 mb-2";

function closeMenu() {
  document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
}

console.log(flatRoutes);

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
        {flatRoutes
          .filter((r) => !!accountAddress && r.key === "user.profile")
          .map((r) => (
            <Link href={r.path} legacyBehavior key={r.path}>
              <a onClick={closeMenu} className="mb-4 text-right">
                {r.title}
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
        {flatRoutes
          .filter((r) => r.type === "feature" && !r.hidden)
          .map((r) => (
            <Link href={r.path} legacyBehavior key={r.path}>
              <a onClick={closeMenu} className="mb-3 text-right">
                {r.title}
              </a>
            </Link>
          ))}
        <h4 className={headingStyles}>About</h4>
        {flatRoutes
          .filter((r) => r.type === "info" && !r.hidden)
          .map((r) =>
            r.external ? (
              <ExternalLink className="mb-3 text-right" href={r.path}>
                {r.title}
              </ExternalLink>
            ) : (
              <Link href={r.path} legacyBehavior key={r.path}>
                <a onClick={closeMenu} className="mb-3 text-right">
                  {r.title}
                </a>
              </Link>
            ),
          )}
        <h4 className={headingStyles}>Developers</h4>
        {flatRoutes
          .filter((r) => r.type === "dev" && !r.hidden)
          .map((r) => (
            <Link href={r.path} legacyBehavior key={r.path}>
              <a onClick={closeMenu} className="mb-3 text-right">
                {r.title}
              </a>
            </Link>
          ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
