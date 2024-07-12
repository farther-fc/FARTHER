export class HandleTipError extends Error {
  originalError: unknown;

  constructor({ originalError }: { originalError?: unknown }) {
    super();

    this.name = "HandleTipError";
    this.originalError = originalError;
  }
}

export class DistributeAllowancesError extends Error {
  originalError: unknown;

  constructor({
    message,
    originalError,
  }: {
    message: string;
    originalError?: unknown;
  }) {
    super(message);

    this.name = "DistributeAllowancesError";
    this.originalError = originalError;
  }
}

export class OpenRankError extends Error {
  originalError: unknown;

  constructor({ originalError }: { originalError?: unknown }) {
    super();

    this.name = "OpenRankError";
    this.originalError = originalError;
  }
}
