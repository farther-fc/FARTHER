import { InfoCard } from "@components/InfoCard";
import { ExternalLink } from "@components/ui/ExternalLink";

function FartherV2Announcement() {
  return (
    <InfoCard variant="attention" className="mb-12">
      <h4 className="mt-0">Announcement!</h4>
      Farther V2 will launch on August 1st with big changes to how tipping
      works. Every tipper will become eligible for monthly rewards based on how
      well they tip quality, underrated users.
      <br />
      <br />
      <ExternalLink href={"https://paragraph.xyz/@farther/farther-v2"}>
        Learn more ✨✨✨
      </ExternalLink>
    </InfoCard>
  );
}

export default FartherV2Announcement;
