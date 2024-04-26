import ComingSoon from "@components/ComingSoon";
import { FartherChannelLink } from "@components/nav/FartherChannelLink";
import React from "react";

function tips() {
  return (
    <ComingSoon>
      <>
        <h2 className="border-none pl-0">Tips coming soon!</h2>
        <br /> Watch the <FartherChannelLink /> for updates.
      </>
    </ComingSoon>
  );
}

export default tips;
