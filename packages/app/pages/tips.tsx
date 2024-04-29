import { FartherChannelLink } from "@components/nav/FartherChannelLink";
import { Container } from "@components/ui/Container";

function tips() {
  return (
    <Container variant="page">
      <div className="flex h-[calc(100vh-300px)] items-center justify-center text-center">
        <div>
          <h2 className="border-none pl-0">Tips coming soon!</h2>
          <br /> Watch the <FartherChannelLink /> for updates.
        </div>
      </div>
    </Container>
  );
}

export default tips;
