import ComingSoon from "@components/ComingSoon";
import { FartherChannelLink } from "@components/nav/FartherChannelLink";
import React from "react";

function tips() {
  return (
    <ComingSoon>
      <>
        <h2>Tips coming soon!</h2>
        <br /> Watch the <FartherChannelLink /> for updates.
      </>
    </ComingSoon>
  );
}

export default tips;
