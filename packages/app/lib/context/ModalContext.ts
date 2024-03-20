import { createContainer } from "@lib/context/unstated"
import React from "react"

type ModalContent = {
  header?: React.ReactNode
  headerText?: string
  body: React.ReactNode
  footer?: React.ReactNode
  closeModal?: () => void
}

const ModalContext = createContainer(function () {
  const [modalContent, setModalContent] = React.useState<ModalContent | null>(
    null
  )

  const openModal = React.useCallback(
    (modalContent: ModalContent | null) => {
      setModalContent(modalContent)
    },
    [setModalContent]
  )

  const closeModal = React.useCallback(() => {
    setModalContent(null)
  }, [])

  return {
    modalContent,
    openModal,
    closeModal,
  }
})

export const ModalProvider = ModalContext.Provider
export const useModal = ModalContext.useContainer
