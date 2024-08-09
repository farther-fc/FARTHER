import { StarLoop } from "@components/StarLoop";
import TokenomicsInfo from "@components/TokenomicsInfo";
import { Container } from "@components/ui/Container";
import { ExternalLink } from "@components/ui/ExternalLink";
import { routes } from "@lib/routes";
import Link from "next/link";

export default function Home() {
  return (
    <Container variant="page">
      <StarLoop />
      <main className="content">
        <h1>Mission</h1>
        <p>
          Farther is a tokenized community accelerating the global adoption of{" "}
          <ExternalLink
            className="font-bold"
            href="https://decrypt.co/215856/what-is-farcaster-ethereum-crypto-twitter-alternative"
          >
            Farcaster
          </ExternalLink>
          .
        </p>
        <h2>Why</h2>
        <ul>
          <li>
            Online social relationships should be as unmediated as they are in
            real life.
          </li>
          <li>
            Cultural norms should be as localizable and enforceable online as
            they are offline.
          </li>
          <li>
            Our attention should not be a product sold to advertisers without
            our awareness or consent.
          </li>
        </ul>
        <p>
          Centralized social networks aren't capable of fulfilling those
          requirements. Many new decentralized social protocols are attempting
          to, but Farcaster stands out as having the greatest potential to do so
          in a way that is both credibly neutral and scalable.
        </p>
        <p className="text-muted mt-8">
          Visit the <Link href={routes.resources.path}>resources page</Link> to
          learn more about what makes Farcaster unique.
        </p>
        <h2>How</h2>
        <p>
          Farther is primarily used as a tipping token with a prediction market
          mechanism to increase quality content and reduce user churn on
          Farcaster. Learn more about how it works{" "}
          <Link href={`${routes.tips.path}#tipping-info`}>here</Link>.
        </p>
        <p>
          In addition to tip allowances and rewards, Farther has a liquidity
          rewards program and ecosystem fund for partnerships and future
          initiatives.
        </p>
        <h2>Tokenomics</h2>
        <TokenomicsInfo />
      </main>
    </Container>
  );
}

export function getStaticProps() {
  return {
    props: {
      seo: {
        title: "",
      },
    },
  };
}
