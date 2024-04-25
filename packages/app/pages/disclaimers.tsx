import { Container } from "@components/ui/Container";
import { ExternalLink } from "@components/ui/ExternalLink";
import { contractAddresses } from "@farther/common";
import React from "react";

function DisclaimersPage() {
  return (
    <div className="content">
      <h1>Disclaimers</h1>
      <p>
        The Farther project has no formal association with{" "}
        <ExternalLink href="https://merklemanufactory.com/">
          Merkle Manufactory
        </ExternalLink>
        . It is an independent experiment intended for fun and community
        building.
      </p>
      <p>The Farther token has no intrinsic value.</p>
      <p>Nothing on this website should be construed as financial advice. </p>
      <p>
        The{" "}
        <ExternalLink
          href={`https://basescan.org/token/${contractAddresses.FARTHER}`}
        >
          Farther smart contracts
        </ExternalLink>{" "}
        have been thoroughly tested and are primarily composed of the
        extensively audited and battle-tested OpenZeppelin contract library,
        however{" "}
        <strong>
          Farther's contracts have not been independently audited. Use at your
          own risk
        </strong>
        .
      </p>
    </div>
  );
}

export default DisclaimersPage;
