export type ItemsList = { category: string; items: ItemsListItem[] }[];

interface ItemsListItem {
  name: string;
  note?: string;
  image?: string;
}
