import { Router } from "express";
import activeShoppingList from "./activeShoppingList.route";
import items from "./items.route";
import users from "./users.route";

const api = Router();

api.use("/users", users);
api.use("/items", items);
api.use("/active-shopping-list", activeShoppingList);

export default api;
