export interface VersionsInterface {
  getSchemaVersion(): string;
  getSubgraphVersion(): string;
  getMethodologyVersion(): string;
}

export class VersionsClass implements VersionsInterface {
  getSchemaVersion(): string {
    return "4.0.1";
  }

  getSubgraphVersion(): string {
    return "1.0.1";
  }

  getMethodologyVersion(): string {
    return "1.0.0";
  }
}

export const Versions = new VersionsClass();
