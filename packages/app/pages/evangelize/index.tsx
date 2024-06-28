import { Container } from "@components/ui/Container";
import { ExternalLink } from "@components/ui/ExternalLink";
import { JULY_ANNOUCEMENT_LINK } from "@lib/constants";

export default function EvangelizePage() {
  return (
    <Container variant="page">
      <div className="mx-auto mt-[20vh] max-w-[350px] text-center">
        <p>
          The evangelist program has concluded and its remaining tokens have
          been reallocated to other Farther features.{" "}
          <ExternalLink href={JULY_ANNOUCEMENT_LINK}>
            Learn more here.
          </ExternalLink>{" "}
        </p>{" "}
        <p className="mt-8">Thank you to all who participated!</p>
      </div>
    </Container>
  );
}

export function getStaticProps() {
  return {
    props: {
      seo: {
        title: "Evangelize",
      },
    },
  };
}
