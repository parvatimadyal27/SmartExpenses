import type { Friend } from "../models/friend.model.js";
import { AppDBManager } from "../models/db-manager.js";

interface PageOptions {
  offset?: number;
  limit?: number;
}

export class FriendsRepository {
  private static instance: FriendsRepository | null = null;

  private dbManager = AppDBManager.getInstance();

  private get friends(): Friend[] {
    return this.dbManager.getDB().table("friends") as Friend[];
  }

  static getInstance() {
    if (!FriendsRepository.instance) {
      FriendsRepository.instance = new FriendsRepository();
    }
    return FriendsRepository.instance;
  }

  addFriend(friend: Friend) {
    if (this.friends.find((f) => f.id === friend.id)) {
      console.log("Friend already exists:", friend.id);
      return;
    }

    friend.name = friend.name || "";
    friend.email = friend.email || "";
    friend.phone = friend.phone || "";

    this.friends.push(friend);
    this.dbManager.save();
    console.log("Friend added:", friend);
  }

  findFriendByEmail(email: string) {
    return this.friends.find((friend) => friend.email === email);
  }

  findFriendByPhone(phone: string) {
    return this.friends.find((friend) => friend.phone === phone);
  }

  findFriendById(id: string) {
    return this.friends.find((friend) => friend.id === id);
  }

  getAllFriends(): Friend[] {
    return this.friends;
  }
  searchFriends(query: string, pageOptions?: PageOptions) {
    const lowerQuery = query.toLowerCase();
    return this.friends
      .filter(
        (friend) =>
          friend.name?.toLowerCase().includes(lowerQuery) ||
          false ||
          friend.email?.toLowerCase().includes(lowerQuery) ||
          false ||
          friend.phone?.toLowerCase().includes(lowerQuery) ||
          false,
      )
      .slice(
        pageOptions?.offset || 0,
        (pageOptions?.offset || 0) + (pageOptions?.limit || 10),
      );
  }

  removeFriends(query: string): Friend[] {
    const matches = this.searchFriends(query, {
      offset: 0,
      limit: this.friends.length,
    });

    if (matches.length === 0) return [];

    const remaining = this.friends.filter((f) => !matches.includes(f));

    this.friends.length = 0;
    this.friends.push(...remaining);

    this.dbManager.save();

    console.log("Removed friends matching query:", query);
    return matches;
  }

  removeFriendById(id: string): boolean {
    const index = this.friends.findIndex((f) => f.id === id);

    if (index === -1) return false;

    this.friends.splice(index, 1);

    this.dbManager.save();

    return true;
  }

  updateFriend(id: string, updatedFriend: Friend): boolean {
    const index = this.friends.findIndex((f) => f.id === id);

    if (index === -1) {
      console.log("Friend not found:", id);
      return false;
    }

    this.friends[index] = updatedFriend;

    this.dbManager.save();

    console.log("Friend updated:", updatedFriend);
    return true;
  }
}
