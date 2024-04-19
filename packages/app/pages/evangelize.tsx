import { SubmitTweet } from "@components/SubmitTweet";
import { Button } from "@components/ui/Button";
import { FARTHER_CHANNEL_URL, ROUTES } from "@lib/constants";
import { useModal } from "@lib/context/ModalContext";
import Link from "next/link";
import React from "react";
import { ExternalLink } from "@components/ui/ExternalLink";
import { useUser } from "@lib/context/UserContext";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { useToast } from "hooks/useToast";
import { EvangelistRules } from "@components/EvangelistRules";
import { YourFarcasterId } from "@components/YourFarcasterId";

export default function EvangelizePage() {
  const { openModal } = useModal();
  const { account, user, userIsLoading } = useUser();
  const { openConnectModal } = useConnectModal();
  const { toast } = useToast();

  const handleSubmit = () => {
    if (!account.address && !!openConnectModal) {
      toast({
        msg: (
          <>
            Please{" "}
            <Button
              variant="link"
              className="text-white underline hover:text-white"
              onClick={openConnectModal}
            >
              connect your wallet
            </Button>{" "}
            before submitting a tweet
          </>
        ),
      });
    } else {
      openModal({
        header: "Submit Tweet",
        body: <SubmitTweet />,
      });
    }
  };

  const isNotOnFarcaster = account.address && !user && !userIsLoading;

  const DEFAULT_TWEET_LINK = `https://twitter.com/intent/tweet?text=Farcaster%20is%20pushing%20social%20media%20$farther%E2%86%97%0A%0AFID${user?.fid}`;

  return (
    <div className="content">
      <h1>Evangelize</h1>
      <p>
        Farcaster users can earn Farther tokens by evangelizing Farcaster on
        legacy social media platforms. The rewards scale based on the number of
        followers of the evangelizing account. Currently, only X (Twitter) is
        supported but more will follow.
      </p>
      <h2>Steps</h2>
      {isNotOnFarcaster && (
        <div className="rounded border border-red-800 p-4">
          A Farcaster user associated with your connected address wasn't found.
          Please double check you have added it as a verified address in your
          Warpcast settings. If you believe this is an error, please reach out
          for help in the{" "}
          <ExternalLink href={FARTHER_CHANNEL_URL}>
            Farther channel
          </ExternalLink>
        </div>
      )}
      <ol>
        {!account.address && (
          <li>
            <Button variant="link" onClick={openConnectModal}>
              Connect your wallet
            </Button>{" "}
          </li>
        )}
        <li>
          {user?.fid ? (
            <ExternalLink href={DEFAULT_TWEET_LINK}>Post a tweet</ExternalLink>
          ) : (
            "Post a tweet"
          )}{" "}
          that includes:{" "}
          <ul>
            <li>"Farcaster"</li>
            <li>
              "FID
              {user?.fid ?? <YourFarcasterId />}"{" "}
              {user?.fid && "(This is your unique Farcaster ID)"}
            </li>
          </ul>
        </li>
        <li>
          Copy the tweet's URL and{" "}
          <Button variant="link" onClick={handleSubmit}>
            submit it here
          </Button>
          .
        </li>
        <li>
          If you meet all the rules below, your reward points will become
          redeemable as Farther tokens on the{" "}
          <Link href={ROUTES.rewards.path}>rewards page</Link> at the end of the
          month.
        </li>
      </ol>

      <h2>Rules</h2>
      <EvangelistRules />
    </div>
  );
}
