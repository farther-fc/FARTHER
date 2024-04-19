import { Container } from "@components/ui/Container";
import React from "react";

function DisclaimersPage() {
  return (
    <div className="content">
      <h1>Disclaimers</h1>
      <p>
        The Farther project is an experiment primarily intended as
        entertainment. The $Farther token has no intrinsic value. Nothing on
        this website should be construed as financial advice.{" "}
      </p>
      <p>
        The Farther smart contracts have been thoroughly tested and are
        primarily composed of the extensively audited and battle-tested
        OpenZeppelin contract library, however{" "}
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
