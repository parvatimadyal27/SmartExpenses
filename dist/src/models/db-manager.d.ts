import { Database } from "../core/storage/db.js";
import type { Friend } from "./friend.model.js";
interface AppData {
    friends: Friend[];
}
export declare class AppDBManager {
    private static sharedInstance;
    private db;
    private constructor();
    static getInstance(): AppDBManager;
    getDB(): Database<AppData>;
    save(): Promise<void>;
}
export {};
//# sourceMappingURL=db-manager.d.ts.map