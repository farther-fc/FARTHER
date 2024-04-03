import { Button } from "@components/ui/Button";
import { useModal } from "@lib/context/ModalContext";
import { Content, Overlay, Portal, Root } from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import React from "react";

export const GlobalModal = () => {
  const { modalContent, closeModal } = useModal();

  const close = modalContent?.closeModal || closeModal;

  return (
    <Root open={!!modalContent}>
      <Portal>
        <Overlay className="z-modal-overlay fixed left-0 top-0 h-screen w-screen bg-slate-600/50 backdrop-blur-sm backdrop-opacity-100 dark:bg-black/50" />
        <Content
          className="z-modal-content bg-muted fixed left-1/2 top-32 min-w-[343px] -translate-x-1/2 overflow-x-hidden rounded-lg p-4 md:min-w-[400px] md:p-8"
          onOpenAutoFocus={(event: any) => event.preventDefault()}
        >
          <div className="space-between flex">
            <div className="space-between semibold flex w-full">
              <h3 className="m-0">
                {!!modalContent?.header
                  ? modalContent?.header
                  : modalContent?.headerText}
              </h3>
            </div>
            <Button onClick={close} size="icon" variant="ghost">
              <X />
            </Button>
          </div>
          <div className="mt-2">{modalContent?.body}</div>
          {modalContent?.footer && (
            <div className="mt-4 flex w-full justify-end gap-2">
              {modalContent.footer}
            </div>
          )}
        </Content>
      </Portal>
    </Root>
  );
};
