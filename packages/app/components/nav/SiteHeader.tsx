import { ThemeToggle } from "@components/ThemeToggle"
import { MainNav } from "@components/nav/MainNav"
import { SiteHeaderUserMenu } from "@components/nav/SiteHeaderUserMenu"
import { useUser } from "@lib/context/UserContext"

export function SiteHeader() {
  const { user } = useUser()
  return (
    <header className="bg-background sticky top-0 z-40 w-full border-b">
      <div className="container flex h-16 items-center sm:justify-between">
        <MainNav />
        <div className="ml-4">
          <ThemeToggle />
        </div>
        {user && <SiteHeaderUserMenu />}
      </div>
    </header>
  )
}
