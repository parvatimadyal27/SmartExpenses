export class ConflictError extends Error {
  public keys: string[];
  constructor(message: string, keys: string[] = []) {
    super(message);
    this.name = "ConflictError";
    this.keys = keys;
  }
}
