import { Button } from "@components/ui/Button";
import { useUser } from "@lib/context/UserContext";
import { useToast } from "hooks/useToast";
import React from "react";

export function YourFarcasterId() {
  const { toast } = useToast();
  const { account } = useUser();

  const handleFidInfoClick = () => {
    toast({
      msg: !account.address
        ? "Connect your wallet to see your Farcaster ID"
        : "No Farcaster ID was found to be associated with your connected address",
    });
  };
  return (
    <>
      &lt;
      <Button variant="link" onClick={handleFidInfoClick}>
        Your Farcaster ID
      </Button>
      &gt;
    </>
  );
}
