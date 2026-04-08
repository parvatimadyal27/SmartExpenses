import type { Friend } from "../models/friend.model.js";
import { FriendsRepository } from "../repository/friends.repository.js";
import { ConflictError } from "../core/errors/conflict.error.js";

export class FriendsController {
  private repository: FriendsRepository;

  constructor() {
    this.repository = FriendsRepository.getInstance();
  }
  private normalizeEmail(email: string) {
    return email.trim().toLowerCase();
  }

  private normalizePhone(phone: string) {
    return phone.replace(/\D/g, "");
  }

  checkEmailExists(email: string, excludeId?: string) {
    return this.repository
      .getAllFriends()
      .some(
        (f) =>
          f.id !== excludeId &&
          this.normalizeEmail(f.email) === this.normalizeEmail(email),
      );
  }

  checkPhoneExists(phone: string, excludeId?: string) {
    return this.repository
      .getAllFriends()
      .some(
        (f) =>
          f.id !== excludeId &&
          this.normalizePhone(f.phone) === this.normalizePhone(phone),
      );
  }

  getFriendById(id: string) {
    return this.repository.findFriendById(id);
  }

  addFriend(friend: Friend) {
    //throw confilct error only if email or phone number already exists
    if (friend.email && this.checkEmailExists(friend.email)) {
      throw new ConflictError("Email already exists", ["email"]);
    }

    if (friend.phone && this.checkPhoneExists(friend.phone)) {
      throw new ConflictError("Phone already exists", ["phone"]);
    }

    this.repository.addFriend(friend);
  }

  // Update

  updateFriend(id: string, updatedData: Partial<Friend>) {
    const existing = this.getFriendById(id);

    if (!existing) {
      throw new Error("Friend not found");
    }

    // Check duplicate email
    if (
      updatedData.email &&
      this.normalizeEmail(updatedData.email) !==
        this.normalizeEmail(existing.email) &&
      this.checkEmailExists(updatedData.email, id)
    ) {
      throw new ConflictError("Email already exists", ["email"]);
    }

    // Check duplicate phone
    if (
      updatedData.phone &&
      this.normalizePhone(updatedData.phone) !==
        this.normalizePhone(existing.phone) &&
      this.checkPhoneExists(updatedData.phone, id)
    ) {
      throw new ConflictError("Phone already exists", ["phone"]);
    }

    // Merge data
    const updatedFriend: Friend = {
      id: existing.id,
      name: updatedData.name ?? existing.name,
      email: updatedData.email ?? existing.email,
      phone: updatedData.phone ?? existing.phone,
      balance: updatedData.balance ?? existing.balance,
    };

    this.repository.updateFriend(id, updatedFriend);

    return updatedFriend;
  }
  searchFriend(query: string) {
    return this.repository.searchFriends(query);
  }

  removeFriend(query: string): Friend[] {
    return this.repository.removeFriends(query);
  }

  //remove friend by id
  removeFriendById(id: string): boolean {
    const existing = this.getFriendById(id);

    if (!existing) {
      console.log("Friend not found");
      return false;
    }

    this.repository.removeFriendById(id);
    return true;
  }

  getAllFriends() {
    return this.repository.getAllFriends();
  }
}
