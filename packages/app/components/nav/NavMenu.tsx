import { Button } from "@components/ui/Button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@components/ui/DropdownMenu";
import { ROUTES } from "@lib/constants";
import { Menu } from "lucide-react";
import Link from "next/link";

function closeMenu() {
  document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
}

export function NavMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="px-2">
          <Menu />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="flex w-40 flex-col px-4 pt-4" align="end">
        {Object.values(ROUTES)
          .filter((route) => !route.hidden)
          .map((route) => (
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
