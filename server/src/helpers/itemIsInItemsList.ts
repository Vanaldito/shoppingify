import { ItemsList } from "../models";

export default function itemIsInItemsList(
  items: ItemsList,
  info: { category: string; name: string }
) {
  const category = items.find(
    el =>
      el.category.toLowerCase().trim() === info.category.toLowerCase().trim()
  );
  if (category === undefined) {
    return false;
  }

  const item = category.items.find(
    item => item.name.toLowerCase().trim() === info.name.toLowerCase().trim()
  );
  if (item === undefined) {
    return false;
  }

  return true;
}
