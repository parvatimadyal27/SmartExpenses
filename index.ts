// import { manageFriends } from "./src/presentation/friend-manager.js";

// //CREATE TABLE `splitwise_db`.`Friends` (`id` INT NOT NULL AUTO_INCREMENT , `Name` VARCHAR NOT NULL , `Phone_No.` INT NOT NULL , `Email` VARCHAR NOT NULL , PRIMARY KEY (`id`), UNIQUE (`Phone_No.`), UNIQUE (`Email`)) ENGINE = InnoDB;

// //INSERT INTO `Friends` (`id`, `name`, `phone`, `email`) VALUES ('1', 'Barney', '785123697', 'barney@gmail.com');

// const run = async () => {
//   console.log("Starting app...");
//   await manageFriends();
// };

// run();

import mysql from "mysql2/promise";

function consoleDir(param: any) {
  console.dir(param, {
    showHidden: false,
    depth: null,
    colors: true,
  });
}

async function runQuery(
  connection: mysql.Connection,
  label: string,
  query: string,
) {
  try {
    console.log(`===Running ${label}===\n`);
    const [results] = await connection.query(query);
    consoleDir(results);
    console.log("\n\n\n");
  } catch (err) {
    console.log(err);
  }
}

const tableName = "`Friends`";

// Select query
const selectQuery = `SELECT * FROM ${tableName}`;
// INSERT
const insertQuery = `INSERT INTO ${tableName} (
    \`id\`, 
    \`name\`, 
    \`phone\`,
    \`email\` 
     ) VALUES (
     NULL, 
    'Himanshu', 
    '94481234',
    'himanshu@gmail.com'
    );
    `;

// UPDATE
const updateQuery = `UPDATE 
${tableName}
SET \`email\` = 'shrijith1234@gmail.com' 
WHERE \`id\` = 2`;

// DELETE
const deleteQuery = `DELETE FROM ${tableName} WHERE \`id\` = 3`;

async function runAllQueries() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST ?? "",
    user: process.env.DB_USER ?? "",
    password: process.env.DB_PASSWORD ?? "",
    database: process.env.DB_NAME ?? "",
  });
  await runQuery(connection, "SELECT", selectQuery);

  await runQuery(connection, "INSERT", insertQuery);
  await runQuery(connection, "SELECT", selectQuery);

  await runQuery(connection, "UPDATE", updateQuery);
  await runQuery(connection, "SELECT", selectQuery);

  await runQuery(connection, "DELETE", deleteQuery);
  await runQuery(connection, "SELECT", selectQuery);

  await connection.end();
}

await runAllQueries();
