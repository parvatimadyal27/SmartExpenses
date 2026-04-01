import { openInteractionManager, type Choice } from "./interaction-manager.js";

const options: Choice = [
  { label: "Add Friend", value: "1" },
  { label: "Update Friend", value: "2" },
  { label: "Remove Friend", value: "3" },
  { label: "Search Friend", value: "4" },
  { label: "Exit", value: "5" },
];

const {ask,choose,close}=openInteractionManager();
const addFriend=async()=>{
  const name = await ask("Enter friend's name:");
  const email=await ask("Enter friend's email");
  const phone = await ask("Enter friends phone number");
  const balance=await ask('Enter opening Balance:')
 
  const 

}
const run=async()=>{
    const choice=await choose('What do you want to do?',options,false);

    switch(choice!.value){
        case '1':console.log('Adding friend....');
                 break;

        case '2':console.log('Updating....');
                 break;

        case '3':console.log('Removing Friend....');
                 break;

        case '4':console.log('Searching....');
                 break;

        case '5':console.log('Exit!!!');
                 break;
            
    }
}

