import { FartherChannelLink } from "@components/nav/FartherChannelLink";
import { Container } from "@components/ui/Container";
import { ExternalLink } from "@components/ui/ExternalLink";

const media = [
  {
    author: "Varun Srinivasan",
    title: "Sufficient Decentralization for Social Networks",
    url: "https://www.varunsrinivasan.com/2022/01/11/sufficient-decentralization-for-social-networks",
  },
  {
    author: "Dan Romero",
    title: "How to grow a protocol",
    url: "https://youtu.be/1B0-M_UokzM?si=XwluNsmaP505PkUb",
  },
  {
    author: "Packy McCormick",
    title: "Framing the Future of the Internet",
    url: "https://www.notboring.co/p/framing-the-future-of-the-internet",
  },
  {
    author: "@links",
    title: "What the Heck Is Farcaster?",
    url: "https://paragraph.xyz/@indypen/what-the-heck-is-farcaster?referrer=0x3eEFAa9d6e2ab7972C1001D41C82BB4881389257",
  },
  {
    author: "@iSpeakNerd",
    title: "Unlocking Potential on Farcaster",
    url: "https://paragraph.xyz/@ispeaknerd.eth/unlocking-potential-on-farcaster?referrer=0x3eefaa9d6e2ab7972c1001d41c82bb4881389257",
  },
];

function ResourcesPage() {
  return (
    <Container variant="page">
      <main className="content">
        <h1>Resources</h1>
        <p className="text-muted">
          This page is a work in progress. Please reach out in the{" "}
          <FartherChannelLink /> if you have any suggestions or have an idea for
          an educational resource that may be a good candidate for grant
          funding.
        </p>
        <h2>Media</h2>

        {media.map((item) => (
          <p key={item.url}>
            <ExternalLink href={item.url}>{item.title}</ExternalLink> —{" "}
            {item.author}
          </p>
        ))}
        <h2>Apps</h2>
        <p>
          <ExternalLink href="https://github.com/a16z/awesome-farcaster/blob/main/README.md">
            Awesome Farcaster
          </ExternalLink>{" "}
          is the most extensive list of Farcaster apps and developer resources.
        </p>
      </main>
    </Container>
  );
}

export default ResourcesPage;
