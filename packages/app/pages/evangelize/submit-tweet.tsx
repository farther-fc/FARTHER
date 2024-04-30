import { SubmitTweet } from "@components/SubmitTweet";
import { Container } from "@components/ui/Container";

function SubmitTweetPage() {
  return (
    <Container variant="page">
      <main className="content">
        <h1> Submit Tweet</h1>
        <SubmitTweet />
      </main>
    </Container>
  );
}

export function getStaticProps() {
  return {
    props: {
      seo: {
        title: "Submit Tweet",
      },
    },
  };
}

export default SubmitTweetPage;
