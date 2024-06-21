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
          <pre>{`const input = encodeURIComponent(JSON.stringify({ address: "0x1234..." }))`}</pre>
        </code>
        <div>
          <hr className="mb-0 mt-10" />
          <h3>User</h3>
          <p className="flex justify-between">
            <span>Get user by address</span>
            <ExampleQuery
              href={`${ROOT_ENDPOINT}/api/v1/public.user.byFid?input=${encodeURIComponent(JSON.stringify({ address: FARTHER_OWNER_ADDRESS }))}`}
            />
          </p>
          <code>
            <pre>{`const params = { address: "0x1234..." } `}</pre>
          </code>
          <code className="mt-2">
            <pre>
              {
                "GET /api/v1/public.user.byAddress?input=<uriEncodedStringifiedParams>"
              }
            </pre>
          </code>
          <p className="mt-6 flex justify-between">
            <span>Get user by FID</span>
            <ExampleQuery
              href={`${ROOT_ENDPOINT}/api/v1/public.user.byAddress?input=${encodeURIComponent(JSON.stringify({ fid: FARTHER_OWNER_FID }))}`}
            />
          </p>
          <code>
            <pre>{`const params = { fid: 1234 }`}</pre>
          </code>
          <code className="mt-2">
            <pre>
              {
                "GET /api/v1/public.user.byFid?input=<uriEncodedStringifiedParams>"
              }
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
          <p className="mt-6 flex justify-between">
            <span>Get tip cycle metadata since a given date</span>
            <ExampleQuery
              href={`${ROOT_ENDPOINT}/api/v1/public.tips.meta?input=%7B"date":"2024-06-01T19:31:14.333Z"%7D`}
            />
          </p>
          <code>
            <pre>{`const params = { date: "2024-06-01T19:31:14.333Z" }`}</pre>
          </code>
          <code className="mt-2">
            <pre>
              {
                "GET /api/v1/public.tips.meta?input=<uriEncodedStringifiedParams>"
              }
            </pre>
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

export default ApiDocsPage;
