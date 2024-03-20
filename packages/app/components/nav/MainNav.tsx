import { SiteHeaderUserMenu } from "@components/nav/SiteHeaderUserMenu"
import { ROUTES } from "@lib/config"
import { useMediaQuery } from "@lib/context/MediaQueryContext"
import { useUser } from "@lib/context/UserContext"
import { cn } from "@lib/utils"
import { useRoutes } from "hooks/useRoutes"
import Link from "next/link"
import * as React from "react"

const linkStyles = cn(
  "text-muted-foreground flex items-center text-sm font-medium"
)

export function MainNav() {
  const { login, user } = useUser()
  const routes = useRoutes()
  const { isTabletSm } = useMediaQuery()

  return (
    <div className="flex w-full gap-6 md:gap-10">
      <Link href="/" className="flex items-center ">
        SELEKT
      </Link>
      <nav className="ml-auto flex gap-6">
        {isTabletSm &&
          routes.map(({ title, path }) => (
            <Link key={path} href={path} className={linkStyles}>
              {title}
            </Link>
          ))}
        {!user && (
          <button onClick={login} className={linkStyles}>
            Sign in
          </button>
        )}
      </nav>
    </div>
  )
}
