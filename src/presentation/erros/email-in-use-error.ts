export class EmailInUseError extends Error {
  constructor() {
    super("The received email alredy in use.");
    this.name = "EmailInUseError";
  }
}
