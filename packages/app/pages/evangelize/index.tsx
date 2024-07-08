import { Container } from "@components/ui/Container";
import { ExternalLink } from "@components/ui/ExternalLink";
import { JULY_ANNOUCEMENT_LINK } from "@lib/constants";

export default function EvangelizePage() {
  return (
    <Container variant="page">
      <div className="mx-auto mt-[20vh] max-w-[350px] text-center">
        <p className="mb-6">
          The evangelist program has concluded. Thank you to all who
          participated!
        </p>
        <p>
          <ExternalLink href={JULY_ANNOUCEMENT_LINK}>
            Learn more here.
          </ExternalLink>{" "}
        </p>{" "}
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
