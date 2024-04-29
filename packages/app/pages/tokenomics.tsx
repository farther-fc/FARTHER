import TokenomicsInfo from "@components/TokenomicsInfo";
import { Container } from "@components/ui/Container";
import React from "react";

function TokenomicsPage() {
  return (
    <Container variant="page">
      <main className="content">
        <h1>Tokenomics</h1>
        <TokenomicsInfo />
      </main>
    </Container>
  );
}

export default TokenomicsPage;
