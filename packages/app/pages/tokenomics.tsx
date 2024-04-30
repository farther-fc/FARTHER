import TokenomicsInfo from "@components/TokenomicsInfo";
import { Container } from "@components/ui/Container";

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

export function getStaticProps() {
  return {
    props: {
      seo: {
        title: "Tokenomics",
      },
    },
  };
}

export default TokenomicsPage;
