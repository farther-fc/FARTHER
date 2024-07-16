export class HandleTipError extends Error {
  originalError: unknown;

  constructor({ originalError }: { originalError?: unknown }) {
    super();

    this.name = "HandleTipError";
    this.originalError = originalError;
  }
}

export class DistributeAllowancesError extends Error {
  readonly name = "DistributeAllowancesError";

  originalError: unknown;

  constructor({
    message,
    originalError,
  }: {
    message: string;
    originalError?: unknown;
  }) {
    super(message);
    this.originalError = originalError;
  }
}

export class OpenRankError extends Error {
  readonly name = "OpenRankError";

  constructor({ message }: { message?: string }) {
    super(message);
  }
}
