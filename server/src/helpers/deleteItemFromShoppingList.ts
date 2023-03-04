import { ShoppingList } from "../models";

export default function deleteItemFromShoppingList(
  shoppingList: ShoppingList,
  info: { category: string; name: string }
) {
  const categoryIndex = shoppingList.list.findIndex(
    el =>
      el.category.toLowerCase().trim() === info.category.toLowerCase().trim()
  );
  if (categoryIndex === -1) {
    return false;
  }

  const itemIndex = shoppingList.list[categoryIndex].items.findIndex(
    item => item.name.toLowerCase().trim() === info.name.toLowerCase().trim()
  );
  if (itemIndex === -1) {
    return false;
  }

  if (shoppingList.list[categoryIndex].items.length === 1) {
    shoppingList.list.splice(categoryIndex, 1);
  } else {
    shoppingList.list[categoryIndex].items.splice(itemIndex, 1);
  }

  return true;
}
