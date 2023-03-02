import { ItemsList } from "../models";

export default function deleteItemFromItemsList(
  items: ItemsList,
  info: { category: string; name: string }
) {
  const categoryIndex = items.findIndex(
    el =>
      el.category.toLowerCase().trim() === info.category.toLowerCase().trim()
  );
  if (categoryIndex === -1) {
    return false;
  }

  const itemIndex = items[categoryIndex].items.findIndex(
    item => item.name.toLowerCase().trim() === info.name.toLowerCase().trim()
  );
  if (itemIndex === -1) {
    return false;
  }

  if (items[categoryIndex].items.length === 1) {
    items.splice(categoryIndex, 1);
  } else {
    items[categoryIndex].items.splice(itemIndex, 1);
  }

  return true;
}
