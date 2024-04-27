import { Button } from "@components/ui/Button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@components/ui/DropdownMenu";
import { ROUTES } from "@lib/constants";
import { useUser } from "@lib/context/UserContext";
import { Menu } from "lucide-react";
import Link from "next/link";

function closeMenu() {
  document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
}

export function NavMenu() {
  const { account } = useUser();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="px-2">
          <Menu />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="flex w-40 flex-col px-4 pt-4 text-lg"
        align="end"
      >
        {Object.entries(ROUTES)
          .filter(([id]) => (!account.address ? id !== "rewards" : true))
          .filter(([_, { type }]) => type === "user")
          .map(([_id, route]) => (
            <Link href={route.path} legacyBehavior key={route.path}>
              <a onClick={closeMenu} className="mb-4 text-right">
                {route.title}
              </a>
            </Link>
          ))}
        <hr className="mb-4 mt-0" />
        {Object.entries(ROUTES)
          .filter(([_, { type }]) => type === "info")
          .map(([_id, route]) => (
            <Link href={route.path} legacyBehavior key={route.path}>
              <a onClick={closeMenu} className="mb-4 text-right">
                {route.title}
              </a>
            </Link>
          ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
