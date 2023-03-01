import { ItemsList } from "../models";
import itemIsInItemsList from "./itemIsInItemsList";

export default function insertItemInItemsList(
  items: ItemsList,
  info: { category: string; name: string; note?: string; image?: string }
) {
  if (itemIsInItemsList(items, { category: info.category, name: info.name })) {
    return false;
  }

  let category = items.find(
    el =>
      el.category.toLowerCase().trim() === info.category.toLowerCase().trim()
  );
  if (category === undefined) {
    category = {
      category: info.category.trim(),
      items: [],
    };

    items.push(category);
  }

  category.items.push({
    name: info.name.trim(),
    note: info.note?.trim(),
    image: info.image?.trim(),
  });

  return true;
}
