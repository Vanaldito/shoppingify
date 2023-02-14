import { DatabaseUserRow } from "../models";
import { UserData } from "../models/UserData.model";

export default function dbUserAdapter(
  dbUserRow: DatabaseUserRow
): UserData & { id: number } {
  let items, activeShoppingList, shoppingHistory;

  try {
    items = JSON.parse(dbUserRow.items);
  } catch {
    throw new Error("Value of items can't be parsed");
  }

  try {
    activeShoppingList = JSON.parse(dbUserRow.activeshoppinglist);
  } catch {
    throw new Error("Value of activeShoppingList can't be parsed");
  }

  try {
    shoppingHistory = JSON.parse(dbUserRow.shoppinghistory);
  } catch {
    throw new Error("Value of shoppingHistory can't be parsed");
  }

  return {
    id: dbUserRow.id,
    email: dbUserRow.email,
    password: dbUserRow.password,
    items,
    activeShoppingList,
    shoppingHistory,
  };
}
