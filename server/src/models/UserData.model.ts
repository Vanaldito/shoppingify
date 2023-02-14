import { ItemsList } from "./ItemsList.model";
import { ShoppingHistory, ShoppingList } from "./ShoppingList.model";

export interface UserData {
  email: string;
  password: string;
  items: ItemsList;
  activeShoppingList: ShoppingList;
  shoppingHistory: ShoppingHistory;
}
