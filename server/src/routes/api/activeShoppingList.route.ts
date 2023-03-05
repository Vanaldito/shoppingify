import { Router } from "express";
import {
  deleteItemFromShoppingList,
  getUserIdFromToken,
  itemIsInItemsList,
  updateItemInShoppingList,
} from "../../helpers";
import { User } from "../../models";

const activeShoppingList = Router();

activeShoppingList.get("/", async (req, res) => {
  const cookies = req.cookies;
  const authToken = cookies["auth-token"];

  const id = getUserIdFromToken(authToken);

  if (id === undefined) {
    return res
      .status(401)
      .json({ status: 401, error: "Auth token is not valid" });
  }

  let user;
  try {
    user = await User.findById(id);
  } catch (err) {
    console.log(err);

    return res
      .status(500)
      .json({ status: 500, error: "Internal server error" });
  }

  if (user === undefined) {
    return res
      .status(404)
      .json({ status: 404, error: "User does not exist or was deleted" });
  }

  return res.status(200).json({
    status: 200,
    data: { activeShoppingList: user.activeShoppingList },
  });
});

activeShoppingList.post("/update", async (req, res) => {
  const cookies = req.cookies;
  const authToken = cookies["auth-token"];

  const id = getUserIdFromToken(authToken);

  if (id === undefined) {
    return res
      .status(401)
      .json({ status: 401, error: "Auth token is not valid" });
  }

  const { category, name, amount, completed } = req.body;

  if (typeof category !== "string" || category.trim() === "") {
    return res.status(400).json({
      status: 400,
      error: "Category is not valid",
    });
  }

  if (typeof name !== "string" || name.trim() === "") {
    return res.status(400).json({ status: 400, error: "Name is not valid" });
  }

  if (
    typeof amount !== "number" ||
    amount <= 0 ||
    amount !== Math.round(amount)
  ) {
    return res.status(400).json({ status: 400, error: "Amount is not valid" });
  }

  if (typeof completed !== "boolean") {
    return res
      .status(400)
      .json({ status: 400, error: "Completed property is not valid" });
  }

  let user;
  try {
    user = await User.findById(id);
  } catch (err) {
    console.log(err);

    return res
      .status(500)
      .json({ status: 500, error: "Internal server error" });
  }

  if (user === undefined) {
    return res
      .status(404)
      .json({ status: 404, error: "User does not exist or was deleted" });
  }

  const items = user.items;

  if (!itemIsInItemsList(items, { category, name })) {
    return res
      .status(409)
      .json({ status: 409, error: "Item is not in the items list" });
  }

  const activeShoppingList = user.activeShoppingList;

  updateItemInShoppingList(activeShoppingList, {
    category,
    name,
    amount,
    completed,
  });

  try {
    await User.updateActiveShoppingList(id, activeShoppingList);
  } catch (err) {
    console.log(err);

    return res
      .status(500)
      .json({ status: 500, error: "Internal server error" });
  }

  return res.status(200).json({ status: 200 });
});

activeShoppingList.post("/delete", async (req, res) => {
  const cookies = req.cookies;
  const authToken = cookies["auth-token"];

  const id = getUserIdFromToken(authToken);

  if (id === undefined) {
    return res
      .status(401)
      .json({ status: 401, error: "Auth token is not valid" });
  }

  const { category, name } = req.body;

  if (typeof category !== "string" || category.trim() === "") {
    return res
      .status(400)
      .json({ status: 400, error: "Category is not valid" });
  }

  if (typeof name !== "string" || name.trim() === "") {
    return res.status(400).json({ status: 400, error: "Name is not valid" });
  }

  let user;
  try {
    user = await User.findById(id);
  } catch (err) {
    console.log(err);

    return res
      .status(500)
      .json({ status: 500, error: "Internal server error" });
  }

  if (user === undefined) {
    return res
      .status(404)
      .json({ status: 404, error: "User does not exist or was deleted" });
  }

  const shoppingList = user.activeShoppingList;

  const wasDeleted = deleteItemFromShoppingList(shoppingList, {
    category,
    name,
  });

  if (!wasDeleted) {
    return res
      .status(404)
      .json({ status: 404, error: "Item is not in the shopping list" });
  }

  try {
    await User.updateActiveShoppingList(id, shoppingList);
  } catch (err) {
    console.error(err);

    return res
      .status(500)
      .json({ status: 500, error: "Internal server error" });
  }

  return res.status(200).json({ status: 200 });
});

activeShoppingList.post("/name", async (req, res) => {
  const cookies = req.cookies;
  const authToken = cookies["auth-token"];

  const id = getUserIdFromToken(authToken);

  if (id === undefined) {
    return res
      .status(401)
      .json({ status: 401, error: "Auth token is not valid" });
  }

  const { name } = req.body;

  if (typeof name !== "string" || name.trim() === "") {
    return res.status(400).json({ status: 400, error: "Name is not valid" });
  }

  let user;
  try {
    user = await User.findById(id);
  } catch (err) {
    console.log(err);

    return res
      .status(500)
      .json({ status: 500, error: "Internal server error" });
  }

  if (user === undefined) {
    return res
      .status(404)
      .json({ status: 404, error: "User does not exist or was deleted" });
  }

  const activeShoppingList = user.activeShoppingList;

  activeShoppingList.name = name.trim();

  try {
    await User.updateActiveShoppingList(id, activeShoppingList);
  } catch (err) {
    console.log(err);

    return res
      .status(500)
      .json({ status: 500, error: "Internal server error" });
  }

  return res.status(200).json({ status: 200 });
});

export default activeShoppingList;
