import { Container } from "@components/ui/Container";

function SubmitTweetPage() {
  return (
    <Container variant="page">
      <main className="content">
        <h1> Submit Tweet</h1>
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
    redirect: {
      destination: "/",
      permanent: true,
    },
  };
}

export default SubmitTweetPage;
