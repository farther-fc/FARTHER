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
  constructor({ message }: { message?: string }) {
    super(message);

    this.name = "OpenRankError";
  }
}

export class SyncUserDataError extends Error {
  originalError: unknown;
  status: number | undefined;

  constructor({
    message,
    status,
    originalError,
  }: {
    message?: string;
    status?: number;
    originalError?: unknown;
  }) {
    super(message);

    this.name = "SyncUserDataError";
    this.originalError = originalError;
    this.status = status;
  }
}
