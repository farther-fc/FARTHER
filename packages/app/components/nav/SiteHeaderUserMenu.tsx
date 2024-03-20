import { Avatar } from "@components/ui/Avatar"
import { Button } from "@components/ui/Button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@components/ui/DropdownMenu"
import { useMediaQuery } from "@lib/context/MediaQueryContext"
import { useUser } from "@lib/context/UserContext"
import { AvatarFallback, AvatarImage } from "@radix-ui/react-avatar"
import { useRoutes } from "hooks/useRoutes"
import { UserIcon } from "lucide-react"
import Link from "next/link"
import React from "react"

export function SiteHeaderUserMenu() {
  const { user, logout } = useUser()
  const [open, setOpen] = React.useState(false)
  const routes = useRoutes()
  const timeout = React.useRef<NodeJS.Timeout>()
  const { isTabletSm } = useMediaQuery()

  const openMenu = () => {
    if (timeout.current) clearTimeout(timeout.current)
    setOpen(true)
  }
  const closeMenu = () => {
    console.log("closing")
    timeout.current = setTimeout(() => setOpen(false), 200)
  }

  return (
    <div className="ml-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild className="focus-visible:ring-offset-0">
          <Button variant="ghost" size="icon" className="w-10 rounded-full">
            {user?.avatarUrl ? (
              <Avatar>
                <AvatarImage src={user.avatarUrl} />
              </Avatar>
            ) : (
              <UserIcon />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" onClick={() => setOpen(false)}>
          {!isTabletSm && (
            <>
              <DropdownMenuGroup>
                {routes.map(({ title, path }) => (
                  <Link href={path}>
                    <DropdownMenuItem
                      key={path}
                      className="cursor-pointer justify-end text-lg"
                    >
                      {title}
                    </DropdownMenuItem>
                  </Link>
                ))}
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
            </>
          )}
          <Button
            variant="ghost"
            onClick={logout}
            className="h-auto w-full justify-end p-0"
          >
            <DropdownMenuItem className="w-full cursor-pointer justify-end text-lg">
              Log out
            </DropdownMenuItem>
          </Button>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
