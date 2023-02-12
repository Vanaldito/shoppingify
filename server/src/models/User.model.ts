import { DatabaseUserRow } from "./DatabaseUserRow.model";
import db from "./db.model";
import { ItemsList } from "./ItemsList.model";
import { ShoppingHistory, ShoppingList } from "./ShoppingList.model";

interface UserData {
  email: string;
  password: string;
  items: ItemsList;
  activeShoppingList: ShoppingList;
  shoppingHistory: ShoppingHistory;
}

export default class User {
  static async save({
    email,
    password,
    items,
    activeShoppingList,
    shoppingHistory,
  }: UserData) {
    await db.query(
      "INSERT INTO users (email, password, items, activeShoppingList, shoppingHistory) VALUES ($1, $2, $3, $4, $5)",
      [email, password, items, activeShoppingList, shoppingHistory]
    );

    return true;
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

    return {
      id: users[0].id,
      email: users[0].email,
      password: users[0].password,
    };
  }
}
