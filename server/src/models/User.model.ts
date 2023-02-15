import { dbUserAdapter } from "../adapters";
import { DatabaseUserRow } from "./DatabaseUserRow.model";
import db from "./db.model";
import { UserData } from "./UserData.model";

export default class User {
  static async save({
    email,
    password,
    items,
    activeShoppingList,
    shoppingHistory,
  }: UserData) {
    const dbResult = await db.query(
      "INSERT INTO users (email, password, items, activeShoppingList, shoppingHistory) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [email, password, items, activeShoppingList, shoppingHistory]
    );

    const users = dbResult.rows as DatabaseUserRow[];

    if (users.length === 0) {
      throw new Error("Internal server error");
    }

    const user = users[0];

    return dbUserAdapter(user);
  }

  static async findByEmail(email: string) {
    const dbResult = await db.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    const users = dbResult.rows as DatabaseUserRow[];

    console.log(users);

    if (users.length === 0) {
      return undefined;
    }

    return dbUserAdapter(users[0]);
  }
}
