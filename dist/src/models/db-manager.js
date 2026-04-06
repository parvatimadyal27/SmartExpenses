import { Database, JsonStorageAdapter } from "../core/storage/db.js";
import fs from "fs";
import path from "path";
export class AppDBManager {
    static sharedInstance;
    db;
    constructor() {
        const filePath = path.resolve("./data/data.json");
        // Ensure file exists
        const dir = path.dirname(filePath);
        if (!fs.existsSync(dir))
            fs.mkdirSync(dir, { recursive: true });
        if (!fs.existsSync(filePath))
            fs.writeFileSync(filePath, JSON.stringify({ friends: [] }));
        this.db = new Database(filePath, new JsonStorageAdapter());
    }
    static getInstance() {
        if (!this.sharedInstance) {
            this.sharedInstance = new AppDBManager();
        }
        return this.sharedInstance;
    }
    getDB() {
        return this.db;
    }
    async save() {
        await this.db.save();
    }
}
//# sourceMappingURL=db-manager.js.map