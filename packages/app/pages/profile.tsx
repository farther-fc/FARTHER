import blurImage from "@components/image/blurImage"
import ProfileImageModal from "@components/modals/ProfileImageModal"
import { Button } from "@components/ui/Button"
import { Container } from "@components/ui/Container"
import { useModal } from "@lib/context/ModalContext"
import { useUser } from "@lib/context/UserContext"
import Image from "next/image"
import React from "react"

export default function ProfilePage() {
  const { user } = useUser()
  const { openModal } = useModal()
  const [_pending, setPending] = React.useState(false)

  const setProfileImageUrl = () => {
    openModal({
      headerText: "Profile image",
      body: <ProfileImageModal setPending={setPending} />,
    })
  }

  return (
    <Container variant="page">
      <div className={`border-input bg-muted relative size-[350px] border`}>
        {user?.avatarUrl && (
          <Image
            src={user.avatarUrl}
            alt="Avatar"
            width={350}
            height={350}
            placeholder="blur"
            blurDataURL={blurImage(350, 350)}
          />
        )}
        <Button
          className="text-primary dark:text-background border-primary absolute bottom-4 left-1/2 -translate-x-1/2 bg-white hover:bg-white"
          onClick={setProfileImageUrl}
        >
          {user?.avatarUrl ? "Change" : "Set a"} profile image
        </Button>
      </div>
    </Container>
  )
}
