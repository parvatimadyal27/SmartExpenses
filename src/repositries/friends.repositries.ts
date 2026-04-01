import type { Friend } from "../model/friend.model.js";

class FriendsRepository{
static instance:FriendsRepository;

static getInstance(){
    if(!FriendsRepository.instance){
        FriendsRepository
    }
}
}

export const friendRepositry= new FriendsRepository();
