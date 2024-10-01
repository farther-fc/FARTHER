import { Container } from "@components/ui/Container";

export default function LiquidityPage() {
  return (
    <Container variant="page">
      <main className="content">
        <h1>Liquidity</h1>
        <div className="mt-16">
          <p>
            <strong>Note for liquidity providers:</strong> Liquidity management
            & rewards claims are no longer provided via farther.social due to
            the data provider's high service costs. However, everything is still
            possible via etherscan. Please email matt@farther.social for
            assistance.
          </p>
        </div>
      </main>
    </Container>
  );
}

export function getStaticProps() {
  return {
    props: {
      seo: {
        title: "Liquidity",
      },
    },
  };
}
