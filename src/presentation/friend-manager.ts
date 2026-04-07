import { numberValidator } from "../core/validators/number.validator.js";
import type { Choice } from "./interaction-manager.js";
import { openInterractionManager } from "./interaction-manager.js";
import { type Friend } from "../models/friend.model.js";
import { FriendsController } from "../controller/friends.controller.js";
import { ConflictError } from "../core/errors/conflict.error.js";
import chalk from "chalk";

const options: Choice[] = [
  { label: "Add Friend", value: "1" },
  { label: "Search Friend", value: "2" },
  { label: "Update Friend", value: "3" },
  { label: "Remove Friend", value: "4" },
  { label: "Exit", value: "5" },
];

const { ask, choose, close } = openInterractionManager();

//Validators
const friendsController = new FriendsController();

const emailValidator = (email: string) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const phoneValidator = (phone: string) => {
  return /^\d{10}$/.test(phone);
};

//Table Function
const printFriendsTable = (friends: Friend[]) => {
  if (!friends.length) {
    console.log("\nNo friends found.\n");
    return;
  }

  const pad = (str: string, length: number) =>
    str.length >= length ? str : str + " ".repeat(length - str.length);

  const nameWidth = Math.max(10, ...friends.map((f) => f.name.length));
  const emailWidth = Math.max(
    20,
    ...friends.map((f) => (f.email || "-").length),
  );
  const phoneWidth = Math.max(
    12,
    ...friends.map((f) => (f.phone || "-").length),
  );
  const balanceWidth = 10;

  const line =
    "+" +
    "-".repeat(4) +
    "+" +
    "-".repeat(nameWidth + 2) +
    "+" +
    "-".repeat(emailWidth + 2) +
    "+" +
    "-".repeat(phoneWidth + 2) +
    "+" +
    "-".repeat(balanceWidth + 2) +
    "+";

  console.log("\n📋 FRIENDS LIST\n");
  console.log(line);

  console.log(
    `| ${pad("#", 2)} | ${pad("Name", nameWidth)} | ${pad("Email", emailWidth)} | ${pad("Phone", phoneWidth)} | ${pad("Balance", balanceWidth)} |`,
  );

  console.log(line);

  friends.forEach((f, i) => {
    let balanceText = "";

    if (f.balance > 0) {
      balanceText = chalk.green("+" + f.balance);
    } else if (f.balance < 0) {
      balanceText = chalk.red(String(f.balance));
    } else {
      balanceText = chalk.yellow("0");
    }

    console.log(
      `| ${pad(String(i + 1), 2)} | ${pad(f.name, nameWidth)} | ${pad(f.email || "-", emailWidth)} | ${pad(f.phone || "-", phoneWidth)} | ${pad(balanceText, balanceWidth)} |`,
    );
  });

  console.log(line + "\n");
};

//Add Friend
const addFriend = async () => {
  const showFriendForm = () => {
    const friendFormData = {
      name: "",
      email: "",
      phone: "",
      balance: "",
    };
    return {
      async getValues(): Promise<void> {
        try {
          //Name
          if (friendFormData.name === "") {
            friendFormData.name = (await ask("Enter friend name:")) || "";
          }

          //Email
          if (friendFormData.email === "") {
            const emailInput = (
              (await ask("Enter friend email (optional) :")) || ""
            ).trim();

            if (emailInput !== "" && !emailValidator(emailInput)) {
              console.log("Invalid email format");
              return await this.getValues();
            }

            friendFormData.email = emailInput;
          }

          //Phone Number
          if (friendFormData.phone === "") {
            const phoneInput =
              (await ask("Enter friend phone (optional):")) || "";

            if (phoneInput !== "" && !phoneValidator(phoneInput)) {
              console.log("Phone must be exactly 10 digits");
              return await this.getValues();
            }

            friendFormData.phone = phoneInput;
          }

          //Balance
          if (friendFormData.balance === "") {
            const balanceInput =
              (await ask(
                "Enter balance (positive = you are owed, negative = you owe):",
              )) || "";

            if (isNaN(Number(balanceInput))) {
              console.log("Balance must be a number");
              return await this.getValues(); // retry only balance
            }

            friendFormData.balance = balanceInput;
          }
          const { name, email, phone, balance } = friendFormData;
          friendsController.addFriend({
            id: Date.now().toString(),
            name,
            email,
            phone,
            balance: Number(balance),
          });
        } catch (error: unknown) {
          if (error instanceof ConflictError) {
            console.log(`Conflict: ${error.message}`);
            for (let key of error.keys) {
              friendFormData[key as keyof typeof friendFormData] = "";
            }
            await this.getValues();
          }
        }
      },
    };
  };
  const form = showFriendForm();
  await form.getValues();
};

// const addFriend = async () => {
//   const name = await ask("Enter friend name:");
//   const email = await ask("Enter friend email:");
//   const phone = await ask("Enter friend phone:");
//   const openingBalance = await ask(
//     "Enter opening balance (positive for amount you are owed, negative for amount you owe):",
//     { defaultAnswer: "0", validator: numberValidator },
//   );
//   if (friendsController.checkEmailExists(email!)) {
//     console.log(`Email ${email} already exists.`);
//     return;
//   }
//   if (friendsController.checkPhoneExists(phone!)) {
//     console.log(`Phone ${phone} already exists.`);
//     return;
//   }

//   const friend: Friend = {
//     id: Date.now().toString(),
//     name: name!,
//     email: email!,
//     phone: phone!,
//     balance: Number(openingBalance),
//   };
//   try {
//     await friendsController.addFriend(friend);
//     console.log(`Friend added: ${name}, ${email}, ${phone}`);
//   } catch (error) {
//     if (error instanceof ConflictError) {
//       console.log(`Conflict: ${error.message}`);
//     } else {
//       console.error("An unexpected error occurred.");
//     }
//   }
// };

const searchFriend = async () => {
  const query = await ask("Enter name to search:");
  const results: Friend[] = friendsController.searchFriend(query!);
  if (results.length === 0) {
    console.log("No friends found.");
    return;
  }
  console.log("Found friends:");
  printFriendsTable(results);
};

const removeFriend = async () => {
  console.log("\n--- Delete Friend ---\n");

  const query = (await ask("Search friend to delete:"))?.trim();
  if (!query) return;

  const results: Friend[] = friendsController.searchFriend(query);

  if (!results || results.length === 0) {
    console.log("No matching friends found.");
    return;
  }

  // Show table instead of raw list
  printFriendsTable(results);

  // Select friend
  const indexInput = await ask("Select friend number to delete:");
  const index = Number(indexInput) - 1;

  const selected = results[index];

  if (!selected) {
    console.log(" Invalid selection.");
    return;
  }

  // Confirmation step
  const confirm = (
    await ask(`Are you sure you want to delete ${selected.name}? (y/n):`)
  )?.toLowerCase();

  if (confirm !== "y") {
    console.log("Delete cancelled.");
    return;
  }

  // Delete ONLY selected friend
  const removed = friendsController.removeFriendById(selected.id);

  console.log("\nFriend deleted successfully.\n");
};

//Update Friend

const updateFriend = async () => {
  console.log(chalk.cyan.bold("\n--- Update Friend ---\n"));

  const query = (await ask("Search friend to update:"))?.trim();
  if (!query) return;

  const results: Friend[] = friendsController.searchFriend(query);

  if (!results || results.length === 0) {
    console.log(chalk.red("No matching friends found."));
    return;
  }

  // Show results
  printFriendsTable(results);

  const indexInput = await ask("Select friend number:");
  const index = Number(indexInput) - 1;

  const selected = results[index];

  if (!selected) {
    console.log(chalk.red("Invalid selection."));
    return;
  }

  console.log(chalk.yellow.bold(`\n---- Updating: ${selected.name}----`));
  console.log(chalk.gray("----Leave empty to keep existing value----\n"));

  try {
    // ---------------- NAME ----------------
    const name = (await ask(`Enter name (${selected.name}):`))?.trim() || "";

    // ---------------- EMAIL ----------------
    let email = "";
    while (true) {
      email =
        (await ask(`Enter email (${selected.email || "-"}):`))?.trim() || "";

      if (email === "" || emailValidator(email)) break;

      console.log(chalk.red("Invalid email format"));
    }

    // ---------------- PHONE ----------------
    let phone = "";
    while (true) {
      phone =
        (await ask(`Enter phone (${selected.phone || "-"}):`))?.trim() || "";

      if (phone === "" || phoneValidator(phone)) break;

      console.log(chalk.red("Phone must be exactly 10 digits"));
    }

    // ---------------- BALANCE ----------------
    let balanceInput = "";
    while (true) {
      balanceInput =
        (await ask(`Enter balance (${selected.balance}):`))?.trim() || "";

      if (balanceInput === "" || !isNaN(Number(balanceInput))) break;

      console.log(chalk.red("Balance must be a number"));
    }

    // ---------------- UPDATE ----------------
    const updated = friendsController.updateFriend(selected.id, {
      name: name || selected.name,
      email: email || selected.email,
      phone: phone || selected.phone,
      balance: balanceInput ? Number(balanceInput) : selected.balance,
    });

    console.log(chalk.green("\nFriend updated successfully!\n"));

    const rawBalance =
      updated.balance > 0 ? "+" + updated.balance : String(updated.balance);

    const coloredBalance =
      updated.balance > 0
        ? chalk.green(rawBalance)
        : updated.balance < 0
          ? chalk.red(rawBalance)
          : chalk.yellow(rawBalance);

    console.log(
      `${chalk.cyan(updated.name)} | ${updated.email || "-"} | ${updated.phone || "-"} | ${coloredBalance}`,
    );
  } catch (error: unknown) {
    if (error instanceof ConflictError) {
      console.log(chalk.red(`Conflict: ${error.message}`));
    } else {
      console.log(chalk.red("Something went wrong."));
    }
  }
};

export const manageFriends = async () => {
  while (true) {
    const choice = await choose("What do you want to do?", options, false);
    switch (choice!.value) {
      case "1":
        console.log("Adding friend...");
        await addFriend();
        break;
      case "2":
        console.log("Searching friend...");
        await searchFriend();
        break;
      case "3":
        console.log("Updating friend...");
        await updateFriend();
        break;
      case "4":
        console.log("Removing friend...");
        await removeFriend();
        break;
      case "5":
        console.log("Exiting...");
        close();
        return;
    }
  }
};
