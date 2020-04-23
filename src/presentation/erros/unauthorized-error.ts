export class UnauthorizedError extends Error {
  constructor() {
    super("unauthorizedError");
    this.name = "ServerError";
  }
}
