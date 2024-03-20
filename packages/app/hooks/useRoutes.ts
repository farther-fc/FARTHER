import { ROUTES } from "@lib/config"
import { useUser } from "@lib/context/UserContext"

export function useRoutes() {
  const { user } = useUser()

  return Object.values(ROUTES).filter((route) => {
    if (route.protectedRoute && !user) {
      return false
    }

    if (route.hidden && user?.role !== "ADMIN") {
      return false
    }
    return true
  })
}
