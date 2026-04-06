import { FriendsRepository } from "../repository/friends.repository.js";
import { ConflictError } from "../core/errors/conflict.error.js";
import { getRandomValues } from "node:crypto";
export class FriendsController {
    repository;
    constructor() {
        this.repository = FriendsRepository.getInstance();
    }
    checkEmailExists(email) {
        return this.repository.findFriendByEmail(email) !== undefined;
    }
    checkPhoneExists(phone) {
        return this.repository.findFriendByPhone(phone) !== undefined;
    }
    getFriendById(id) {
        return this.repository.findFriendById(id);
    }
    addFriend(friend) {
        if (this.getFriendById(friend.id)) {
            throw new ConflictError("Friend with this ID already exists", ["id"]);
        }
        if (this.checkEmailExists(friend.email)) {
            throw new ConflictError("Email already exists", ["email"]);
        }
        if (this.checkPhoneExists(friend.phone)) {
            throw new ConflictError("Phone already exists", ["phone"]);
        }
        this.repository.addFriend(friend);
    }
    searchFriend(query) {
        return this.repository.searchFriends(query);
    }
    removeFriend(query) {
        return this.repository.removeFriends(query);
    }
}
//# sourceMappingURL=friends.controller.js.map