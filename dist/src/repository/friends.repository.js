import { AppDBManager } from "../models/db-manager.js";
export class FriendsRepository {
    static instance = null;
    friends;
    dbManager = AppDBManager.getInstance();
    constructor() {
        const db = this.dbManager.getDB();
        this.friends = db.table("friends");
    }
    static getInstance() {
        if (!FriendsRepository.instance) {
            FriendsRepository.instance = new FriendsRepository();
        }
        return FriendsRepository.instance;
    }
    addFriend(friend) {
        if (this.friends.find(f => f.id === friend.id)) {
            console.log('Friend already exists:', friend.id);
            return;
        }
        friend.name = friend.name || "";
        friend.email = friend.email || "";
        friend.phone = friend.phone || "";
        this.friends.push(friend);
        this.dbManager.save();
        console.log('Friend added:', friend);
    }
    findFriendByEmail(email) {
        return this.friends.find(friend => friend.email === email);
    }
    findFriendByPhone(phone) {
        return this.friends.find(friend => friend.phone === phone);
    }
    findFriendById(id) {
        return this.friends.find(friend => friend.id === id);
    }
    searchFriends(query, pageOptions) {
        const lowerQuery = query.toLowerCase();
        return this.friends
            .filter(friend => (friend.name?.toLowerCase().includes(lowerQuery) || false) ||
            (friend.email?.toLowerCase().includes(lowerQuery) || false) ||
            (friend.phone?.toLowerCase().includes(lowerQuery) || false))
            .slice(pageOptions?.offset || 0, (pageOptions?.offset || 0) + (pageOptions?.limit || 10));
    }
    removeFriends(query) {
        const matches = this.searchFriends(query, { offset: 0, limit: this.friends.length });
        if (matches.length === 0)
            return [];
        this.friends = this.friends.filter(f => !matches.includes(f));
        const db = this.dbManager.getDB();
        const table = db.table("friends");
        table.length = 0;
        table.push(...this.friends);
        this.dbManager.save();
        console.log('Removed friends matching query:', query);
        return matches;
    }
}
//# sourceMappingURL=friends.repository.js.map