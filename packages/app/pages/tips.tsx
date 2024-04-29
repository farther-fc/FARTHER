import ComingSoon from "@components/ComingSoon";
import { FartherChannelLink } from "@components/nav/FartherChannelLink";
import { Container } from "@components/ui/Container";
import React from "react";

function tips() {
  return (
    <Container variant="page">
      <ComingSoon>
        <>
          <h2 className="border-none pl-0">Tips coming soon!</h2>
          <br /> Watch the <FartherChannelLink /> for updates.
        </>
      </ComingSoon>
    </Container>
  );
}

export default tips;
