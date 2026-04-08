import type { Friend } from "../models/friend.model.js";
export declare class FriendsController {
    private repository;
    constructor();
    private normalizeEmail;
    private normalizePhone;
    checkEmailExists(email: string, excludeId?: string): boolean;
    checkPhoneExists(phone: string, excludeId?: string): boolean;
    getFriendById(id: string): Friend | undefined;
    addFriend(friend: Friend): void;
    updateFriend(id: string, updatedData: Partial<Friend>): Friend;
    searchFriend(query: string): Friend[];
    removeFriend(query: string): Friend[];
    removeFriendById(id: string): boolean;
    getAllFriends(): Friend[];
}
//# sourceMappingURL=friends.controller.d.ts.map