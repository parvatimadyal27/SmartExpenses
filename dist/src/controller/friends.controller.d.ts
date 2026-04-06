import type { Friend } from "../models/friend.model.js";
export declare class FriendsController {
    private repository;
    constructor();
    checkEmailExists(email: string): boolean;
    checkPhoneExists(phone: string): boolean;
    getFriendById(id: string): Friend | undefined;
    addFriend(friend: Friend): void;
    searchFriend(query: string): Friend[];
    removeFriend(query: string): Friend[];
}
//# sourceMappingURL=friends.controller.d.ts.map