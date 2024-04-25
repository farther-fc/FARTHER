import { ExternalLink } from "@components/ui/ExternalLink";
import { FARTHER_CHANNEL_URL } from "@lib/constants";
import React from "react";

export function FartherChannelLink() {
  return (
    <ExternalLink href={FARTHER_CHANNEL_URL}>Farther channel</ExternalLink>
  );
}
