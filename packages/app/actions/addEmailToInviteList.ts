import { ROUTES } from "@lib/config"
import { prisma } from "@lib/prisma"
import { revalidatePath } from "next/cache"

export async function addEmailToInviteList(formData: FormData) {
  const email = formData.get("email") as string

  const upsertedInvite = await prisma.invite.upsert({
    where: {
      email,
    },
    update: {},
    create: {
      email,
    },
  })

  revalidatePath(ROUTES.admin.path)

  return upsertedInvite
}
