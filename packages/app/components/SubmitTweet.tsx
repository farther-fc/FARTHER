import { EvangelistRules } from "@components/EvangelistRules";
import { Button } from "@components/ui/Button";
import { ExternalLink } from "@components/ui/ExternalLink";
import { Form, FormField, FormItem, FormMessage } from "@components/ui/Form";
import { Input } from "@components/ui/Input";
import { Label } from "@components/ui/Label";
import { POWER_BADGE_INFO_URL, ROUTES } from "@lib/constants";
import { useModal } from "@lib/context/ModalContext";
import { useUser } from "@lib/context/UserContext";
import { trpcClient } from "@lib/trpcClient";
import { extractTweetId } from "@lib/utils";
import { useLogError } from "hooks/useLogError";
import { useToast } from "hooks/useToast";
import Link from "next/link";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const FormSchema = z.object({
  tweetUrl: z.string(),
});

type FormData = z.infer<typeof FormSchema>;

export function SubmitTweet() {
  const { closeModal } = useModal();
  const { toast } = useToast();
  const { user, refetchUser } = useUser();
  const logError = useLogError();
  const form = useForm<FormData>({
    defaultValues: {
      tweetUrl: "",
    },
  });
  const validateTweetMutation = trpcClient.validateTweet.useMutation();

  const submitTweetUrl = async (data: FormData) => {
    if (!user) return;

    const tweetId = extractTweetId(data.tweetUrl);

    if (typeof tweetId !== "string") {
      toast({
        variant: "error",
        msg: "Invalid tweet URL. Please check it and try again.",
      });
      return;
    }

    try {
      const { isValid, reason } = await validateTweetMutation.mutateAsync({
        tweetId,
        fid: user.fid,
      });

      if (!isValid) {
        toast({ msg: reason, variant: "info" });
      } else {
        closeModal();
        refetchUser();
        toast({
          msg: (
            <>
              {user.powerBadge ? (
                <>
                  Success! You have two months to earn a{" "}
                  <ExternalLink href={POWER_BADGE_INFO_URL}>
                    Warpcast power badge
                  </ExternalLink>
                  . Once you do, check the{" "}
                  <Link href={ROUTES.rewards.path}>rewards page</Link> page.
                </>
              ) : (
                <>
                  Congrats! You have pending evangelist rewards. They will
                  become claimable on the{" "}
                  <Link href={ROUTES.rewards.path}>rewards page</Link> at the
                  end of the month.
                </>
              )}
            </>
          ),
        });
      }
    } catch (error) {
      logError({ error, capture: true, showGenericToast: true });
    }
  };

  React.useEffect(() => {
    if (validateTweetMutation.error?.data?.zodError) {
      logError({
        error: JSON.stringify(
          validateTweetMutation.error?.data?.zodError,
          null,
          2,
        ),
        showGenericToast: true,
      });
      return;
    }

    const error = validateTweetMutation.error?.shape;

    const showGenericToast = !!(error && error.data.code !== "BAD_REQUEST");

    logError({
      error: validateTweetMutation.error,
      showGenericToast,
      toastMsg: error?.message,
    });
  }, [validateTweetMutation.error, logError]);

  return (
    <div>
      <EvangelistRules />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(submitTweetUrl)}>
          <FormField
            control={form.control}
            name="tweetUrl"
            render={({ field }) => (
              <FormItem>
                <Label className="mb-1 mt-8 block" htmlFor="tweetUrl">
                  Tweet URL
                </Label>
                <Input placeholder="https://twitter.com/..." {...field} />
              </FormItem>
            )}
          />
          <Button
            loadingText="Validating"
            className="mt-4"
            type="submit"
            disabled={!user}
            loading={validateTweetMutation.isPending}
          >
            Submit
          </Button>
          {!user && (
            <FormMessage className="text-destructive">
              No Farcaser user found associated with your address
            </FormMessage>
          )}
        </form>
      </Form>
    </div>
  );
}
