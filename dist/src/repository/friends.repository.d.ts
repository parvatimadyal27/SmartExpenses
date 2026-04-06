import type { Friend } from "../models/friend.model.js";
interface PageOptions {
    offset?: number;
    limit?: number;
}
export declare class FriendsRepository {
    private static instance;
    friends: Friend[];
    private dbManager;
    private constructor();
    static getInstance(): FriendsRepository;
    addFriend(friend: Friend): void;
    findFriendByEmail(email: string): Friend | undefined;
    findFriendByPhone(phone: string): Friend | undefined;
    findFriendById(id: string): Friend | undefined;
    searchFriends(query: string, pageOptions?: PageOptions): Friend[];
    removeFriends(query: string): Friend[];
}
export {};
//# sourceMappingURL=friends.repository.d.ts.map