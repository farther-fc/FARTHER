import { isProduction } from "@lib/env"
import React from "react"

export const TemporaryPasswordWrapper = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const [isAuthenticated, setIsAuthenticated] = React.useState(false)
  React.useEffect(() => {
    if (!isProduction) {
      setIsAuthenticated(true)
      return
    }

    const isAuthenticated = localStorage.getItem("isAuthenticated")
    if (isAuthenticated === "true") {
      setIsAuthenticated(true)
    } else {
      const pw = prompt("Enter password")
      if (pw === "🤌") {
        setIsAuthenticated(true)
        localStorage.setItem("isAuthenticated", "true")
      }
    }
  }, [])

  return isAuthenticated ? <>{children}</> : <>Not authorized</>
}
