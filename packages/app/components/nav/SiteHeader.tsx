import { ThemeToggle } from "@components/ThemeToggle";
import { MainNav } from "@components/nav/MainNav";

export function SiteHeader() {
  return (
    <header className="bg-background sticky top-0 z-40 w-full border-b">
      <div className="container flex h-16 items-center sm:justify-between">
        <MainNav />
        <div className="ml-4">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
