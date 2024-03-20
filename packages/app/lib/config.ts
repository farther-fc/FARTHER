type RouteNames = "dashboard" | "upload" | "profile" | "admin"

type NavItem = {
  title: string
  path: string
  protectedRoute?: boolean
  hidden?: boolean
}

export const ROUTES: { [key in RouteNames]: NavItem } = {
  dashboard: {
    title: "Dashboard",
    path: "/dashboard",
    protectedRoute: true,
  },
  upload: {
    title: "Upload",
    path: "/upload",
    protectedRoute: true,
  },
  profile: {
    title: "Profile",
    path: "/profile",
    protectedRoute: true,
  },
  admin: {
    title: "Admin",
    path: "/admin",
    protectedRoute: true,
    hidden: true,
  },
}
