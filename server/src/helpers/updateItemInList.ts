import { ShoppingList } from "../models";

export default function updateItemInShoppingList(
  shoppingList: ShoppingList,
  info: { category: string; name: string; amount: number; completed: boolean }
) {
  const list = shoppingList.list;

  let category = list.find(
    el =>
      el.category.toLowerCase().trim() === info.category.toLowerCase().trim()
  );
  if (category === undefined) {
    category = { category: info.category.trim(), items: [] };
    list.push(category);
  }

  const item = category.items.find(
    item => item.name.toLowerCase().trim() === info.name.toLowerCase().trim()
  );
  if (item !== undefined) {
    item.amount = info.amount;
    item.completed = info.completed;

    return;
  }

  category.items.push({
    name: info.name.trim(),
    amount: info.amount,
    completed: info.completed,
  });
}
