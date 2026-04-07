import type { Friend } from "../models/friend.model.js";
interface PageOptions {
    offset?: number;
    limit?: number;
}
export declare class FriendsRepository {
    private static instance;
    private dbManager;
    private get friends();
    static getInstance(): FriendsRepository;
    addFriend(friend: Friend): void;
    findFriendByEmail(email: string): Friend | undefined;
    findFriendByPhone(phone: string): Friend | undefined;
    findFriendById(id: string): Friend | undefined;
    getAllFriends(): Friend[];
    searchFriends(query: string, pageOptions?: PageOptions): Friend[];
    removeFriends(query: string): Friend[];
    removeFriendById(id: string): boolean;
    updateFriend(id: string, updatedFriend: Friend): boolean;
}
export {};
//# sourceMappingURL=friends.repository.d.ts.map