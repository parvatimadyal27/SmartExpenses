import { FriendsRepository } from "../repository/friends.repository.js";
import { ConflictError } from "../core/errors/conflict.error.js";
export class FriendsController {
    repository;
    constructor() {
        this.repository = FriendsRepository.getInstance();
    }
    normalizeEmail(email) {
        return email.trim().toLowerCase();
    }
    normalizePhone(phone) {
        return phone.replace(/\D/g, "");
    }
    checkEmailExists(email, excludeId) {
        return this.repository
            .getAllFriends()
            .some((f) => f.id !== excludeId &&
            this.normalizeEmail(f.email) === this.normalizeEmail(email));
    }
    checkPhoneExists(phone, excludeId) {
        return this.repository
            .getAllFriends()
            .some((f) => f.id !== excludeId &&
            this.normalizePhone(f.phone) === this.normalizePhone(phone));
    }
    getFriendById(id) {
        return this.repository.findFriendById(id);
    }
    addFriend(friend) {
        if (this.getFriendById(friend.id)) {
            throw new ConflictError("Friend with this ID already exists", ["id"]);
        }
        if (friend.email && this.checkEmailExists(friend.email)) {
            throw new ConflictError("Email already exists", ["email"]);
        }
        if (friend.phone && this.checkPhoneExists(friend.phone)) {
            throw new ConflictError("Phone already exists", ["phone"]);
        }
        this.repository.addFriend(friend);
    }
    // ------------------- Update -------------------
    updateFriend(id, updatedData) {
        const existing = this.getFriendById(id);
        if (!existing) {
            throw new Error("Friend not found");
        }
        // Check duplicate email
        if (updatedData.email &&
            this.normalizeEmail(updatedData.email) !==
                this.normalizeEmail(existing.email) &&
            this.checkEmailExists(updatedData.email, id)) {
            throw new ConflictError("Email already exists", ["email"]);
        }
        // Check duplicate phone
        if (updatedData.phone &&
            this.normalizePhone(updatedData.phone) !==
                this.normalizePhone(existing.phone) &&
            this.checkPhoneExists(updatedData.phone, id)) {
            throw new ConflictError("Phone already exists", ["phone"]);
        }
        // Merge data
        const updatedFriend = {
            id: existing.id,
            name: updatedData.name ?? existing.name,
            email: updatedData.email ?? existing.email,
            phone: updatedData.phone ?? existing.phone,
            balance: updatedData.balance ?? existing.balance,
        };
        this.repository.updateFriend(id, updatedFriend);
        return updatedFriend;
    }
    searchFriend(query) {
        return this.repository.searchFriends(query);
    }
    removeFriend(query) {
        return this.repository.removeFriends(query);
    }
    //remove friend by id
    removeFriendById(id) {
        const existing = this.getFriendById(id);
        if (!existing) {
            console.log("Friend not found");
            return false;
        }
        this.repository.removeFriendById(id);
        return true;
    }
}
//# sourceMappingURL=friends.controller.js.map