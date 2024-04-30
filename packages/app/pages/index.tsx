import { StarLoop } from "@components/StarLoop";
import TokenomicsInfo from "@components/TokenomicsInfo";
import { EcosystemFundModal } from "@components/modals/EcosystemFundModal";
import { Button } from "@components/ui/Button";
import { Container } from "@components/ui/Container";
import { ExternalLink } from "@components/ui/ExternalLink";
import { ROUTES } from "@lib/constants";
import { useModal } from "@lib/context/ModalContext";
import Link from "next/link";

export default function Home() {
  const { openModal } = useModal();

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
          Visit the <Link href={ROUTES.resources.path}>resources page</Link> to
          learn more about what makes Farcaster unique.
        </p>

        <h2>How</h2>
        <p>
          FARTHER is an Ethereum token deployed on Base that is meant to
          incentivize Farcaster user growth. It is being rewarded to active
          users and builders within the ecosystem in the following ways:
        </p>
        <ul>
          <li>
            <Link href={ROUTES.airdrop.path}>Airdrops</Link> to Farcaster power
            users spanning 3 years, beginning May 1, 2024.
          </li>
          <li>
            {" "}
            <Link href={ROUTES.evangelize.path}>Evangelist rewards</Link> for
            expressing love of Farcaster on legacy social apps
          </li>
          <li>
            <Link href={ROUTES.liquidty.path}>Onchain liquidity rewards</Link>
          </li>
          <li>
            <Link href={ROUTES.tips.path}>Tip allocations</Link>
          </li>
          <li>
            <Button
              variant="link"
              onClick={() =>
                openModal({
                  headerText: "Ecosystem fund",
                  body: <EcosystemFundModal />,
                })
              }
            >
              Partnerships & ecosystem fund
            </Button>
          </li>
        </ul>

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
