import { trpcClient } from "../trpcClient"
import { createContainer } from "./unstated"
import { usePrivy } from "@privy-io/react-auth"

export const UserContext = createContainer(() => {
  /**
   * We use Privy for authentication. If privyUser exists, it means the user is logged in.
   */
  const { login, logout, user: privyUser } = usePrivy()

  const user = trpcClient.getAuthenticatedUser.useQuery(
    {
      privyId: privyUser?.id || "",
      email: privyUser?.email?.address || "",
    },
    // Don't fetch user if not logged in
    { enabled: !!privyUser }
  )

  return {
    user: privyUser ? user.data : null,
    login,
    logout,
  }
})

export const useUser = UserContext.useContainer
export const UserProvider = UserContext.Provider
