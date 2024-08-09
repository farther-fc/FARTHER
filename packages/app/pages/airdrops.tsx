import { InfoCard } from "@components/InfoCard";
import { Container } from "@components/ui/Container";
import { ExternalLink } from "@components/ui/ExternalLink";

export default function AirdropPage() {
  return (
    <Container variant="page">
      <main className="content">
        <h1>Powerdrops</h1>
        <InfoCard className="mx-auto text-center mt-12 ">
          <p className="max-w-[500px] mx-auto">
            The powerdrops program has concluded and all its remaining tokens
            have been reallocated to tipping.{" "}
            <ExternalLink href="https://warpcast.com/farther/0x8f2fa9e4">
              Learn more here.
            </ExternalLink>
          </p>
        </InfoCard>
      </main>
    </Container>
  );
}

export function getStaticProps() {
  return {
    props: {
      seo: {
        title: "Powerdrops",
      },
    },
  };
}
