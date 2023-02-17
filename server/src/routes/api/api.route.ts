import { Router } from "express";
import items from "./items.route";
import users from "./users.route";

const api = Router();

api.use("/users", users);
api.use("/items", items);

export default api;
