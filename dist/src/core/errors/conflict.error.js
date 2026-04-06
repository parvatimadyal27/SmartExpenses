export class ConflictError extends Error {
    keys;
    constructor(message, keys = []) {
        super(message);
        this.name = "ConflictError";
        this.keys = keys;
    }
}
//# sourceMappingURL=conflict.error.js.map