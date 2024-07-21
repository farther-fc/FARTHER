import { Button } from "@components/ui/Button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@components/ui/DropdownMenu";
import { ExternalLink } from "@components/ui/ExternalLink";
import { clickIds } from "@lib/constants";
import { useUser } from "@lib/context/UserContext";
import { Route, routesTree } from "@lib/routes";
import { cn } from "@lib/utils";
import { Menu } from "lucide-react";
import Link from "next/link";

function closeMenu() {
  document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
}

const headingStyles =
  "text-right pt-3 uppercase font-normal text-muted text-xs mt-0 mb-2 px-3 select-none";

const navLinkStyles =
  "block w-full text-right no-underline hover:no-underline hover:bg-white/5 px-3 py-1 rounded-md text-lg text-link hover:text-link-hover mb-[2px]";

const NavLink = ({ route }: { route: Route }) => {
  return route.external ? (
    <ExternalLink href={route.path} className={navLinkStyles}>
      {route.title}
    </ExternalLink>
  ) : (
    <Link href={route.path} legacyBehavior className={navLinkStyles}>
      <a onClick={closeMenu} className={navLinkStyles}>
        {route.title}
      </a>
    </Link>
  );
};

const renderLinks = (routes: Route[]) => {
  return routes.map((route) =>
    route.subroutes && route.subroutes.length ? (
      <>
        <DropdownMenuSub key={route.path}>
          <DropdownMenuSubTrigger
            className={cn(
              // navLinkStyles,
              "data-[state=open]:bg-white/[.03] hover:data-[state=open]:bg-white/[0] text-right",
            )}
          >
            <NavLink route={route} />
          </DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent className="border-ghost" sideOffset={4}>
              {renderLinks(route.subroutes)}
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>
      </>
    ) : (
      <NavLink route={route} />
    ),
  );
};

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
      <DropdownMenuContent className="flex w-40 flex-col pt-4" align="end">
        <h4 className={cn(headingStyles, "border-none pt-0")}>User</h4>
        {renderLinks(
          routesTree.filter((r) => !!accountAddress && r.type === "User"),
        )}
        <DropdownMenuSeparator />
        <h4
          className={cn(
            headingStyles,
            !accountAddress ? "border-none pt-0 font-normal" : "",
          )}
        >
          Features
        </h4>
        {renderLinks(
          routesTree.filter((r) => r.type === "Feature" && !r.hidden),
        )}
        <DropdownMenuSeparator />
        <h4 className={headingStyles}>About</h4>
        {renderLinks(routesTree.filter((r) => r.type === "Info" && !r.hidden))}
        <DropdownMenuSeparator />
        <h4 className={headingStyles}>Devs</h4>
        {renderLinks(routesTree.filter((r) => r.type === "Dev" && !r.hidden))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
