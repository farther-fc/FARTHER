import { Container } from "@components/ui/Container";
import { ExternalLink } from "@components/ui/ExternalLink";
import {
  FARTHER_OWNER_ADDRESS,
  FARTHER_OWNER_FID,
  ROOT_ENDPOINT,
} from "@farther/common";

const ExampleQuery = ({ href }: { href: string }) => (
  <ExternalLink href={href} className="mb-2 text-sm">
    Example Query
  </ExternalLink>
);

function ApiDocsPage() {
  return (
    <Container variant="page">
      <main className="content">
        <h1>API Docs</h1>
        <p>Query parameters must be stringified and URI encoded. Ex:</p>
        <code>
          <pre>
            {`const stringifiedParams = JSON.stringify({ address: "0x1234..." })`}
            <br />
            <br />
            {`const uriEncodedParams = encodeURIComponent(stringifiedParams)`}
          </pre>
        </code>
        <div>
          <hr className="mb-0 mt-10" />
          <h3>User</h3>
          <p className="flex justify-between">
            <span>Get user by address</span>
            <ExampleQuery
              href={`${ROOT_ENDPOINT}/api/v1/public.user.byFid?input=${encodeURIComponent(JSON.stringify({ fid: FARTHER_OWNER_FID }))}`}
            />
          </p>
          <code>
            <pre>
              {"GET /api/v1/public.user.byAddress?input=<uriEncodedParams>"}
            </pre>
          </code>
          <p className="flex justify-between">
            <span>Get user by FID</span>
            <ExampleQuery
              href={`${ROOT_ENDPOINT}/api/v1/public.user.byAddress?input=${encodeURIComponent(JSON.stringify({ address: FARTHER_OWNER_ADDRESS }))}`}
            />
          </p>
          <code>
            <pre>
              {"GET /api/v1/public.user.byFid?input=<uriEncodedParams>"}
            </pre>
          </code>
        </div>
        <div>
          <hr className="mb-0 mt-10" />
          <h3>Tips</h3>
          <p className="flex justify-between">
            <span>Get current tip cycle metadata</span>
            <ExampleQuery href={`${ROOT_ENDPOINT}/api/v1/public.tips.meta`} />
          </p>
          <code>
            <pre>{"GET /api/v1/public.tips.meta"}</pre>
          </code>
        </div>
        <div>
          <hr className="mb-0 mt-10" />
          <h3>Token</h3>
          <p className="flex justify-between">
            <span>Get current FARTHER price</span>
            <ExampleQuery href={`${ROOT_ENDPOINT}/api/v1/public.token.price`} />
          </p>
          <code>
            <pre>{"GET /api/v1/public.token.price"}</pre>
          </code>
        </div>
      </main>
    </Container>
  );
}

export function getStaticProps() {
  return {
    props: {
      seo: {
        title: "API Docs",
      },
    },
  };
}

export default ApiDocsPage;
