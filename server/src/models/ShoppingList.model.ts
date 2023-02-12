export interface ShoppingList {
  name: string;
  list: {
    category: string;
    items: ShoppingListItem[];
  }[];
}

interface ShoppingListItem {
  name: string;
  amount: number;
  completed: boolean;
}

export type ShoppingHistory = FinishedShoppingList[];

interface FinishedShoppingList extends ShoppingList {
  state: "completed" | "cancelled";
  date: string;
}
