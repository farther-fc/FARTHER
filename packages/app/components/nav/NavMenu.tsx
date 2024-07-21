import { Button } from "@components/ui/Button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@components/ui/DropdownMenu";
import { clickIds } from "@lib/constants";
import { useUser } from "@lib/context/UserContext";
import { Route, routesTree } from "@lib/routes";
import { Menu } from "lucide-react";
import Link from "next/link";

function closeMenu() {
  document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
}

const renderLinks = (routes: Route[]) => {
  return routes.map((route) =>
    route.subroutes && route.subroutes.length ? (
      <div key={route.path}>{renderLinks(route.subroutes)}</div>
    ) : (
      <Link href={route.path} legacyBehavior key={route.path}>
        <a onClick={closeMenu} className="mb-3 text-right">
          {route.title}
        </a>
      </Link>
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
      <DropdownMenuContent
        className="flex w-40 flex-col px-4 pt-4 text-lg"
        align="end"
      >
        {renderLinks(
          routesTree.filter((r) => !!accountAddress && r.type === "User"),
        )}
        <DropdownMenuSeparator />
        {renderLinks(
          routesTree.filter((r) => r.type === "Feature" && !r.hidden),
        )}
        <DropdownMenuSeparator />
        {renderLinks(routesTree.filter((r) => r.type === "Info" && !r.hidden))}
        <DropdownMenuSeparator />
        {renderLinks(routesTree.filter((r) => r.type === "Dev" && !r.hidden))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
