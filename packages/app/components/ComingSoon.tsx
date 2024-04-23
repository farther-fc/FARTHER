import { FartherChannelLink } from "@components/nav/FartherChannelLink";
import React from "react";

function ComingSoon() {
  return (
    <div className="flex h-[calc(100vh-300px)] items-center justify-center text-center">
      <div>
        <h2>Coming Soon!</h2>
        <br /> Watch the <FartherChannelLink /> for updates.
      </div>
    </div>
  );
}

export default ComingSoon;
