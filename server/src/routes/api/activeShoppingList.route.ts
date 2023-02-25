import { Router } from "express";
import { getUserIdFromToken } from "../../helpers";
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

  function itemIsInItemsList() {
    const categoryIndex = items.findIndex(
      el => el.category.toLowerCase().trim() === category.toLowerCase().trim()
    );
    if (categoryIndex === -1) {
      return false;
    }

    const itemIndex = items[categoryIndex].items.findIndex(
      item => item.name.toLowerCase().trim() === name.toLowerCase().trim()
    );
    if (itemIndex === -1) {
      return false;
    }

    return true;
  }

  if (!itemIsInItemsList()) {
    return res
      .status(409)
      .json({ status: 409, error: "Item is not in the items list" });
  }

  const activeShoppingList = user.activeShoppingList;

  let categoryIndex = activeShoppingList.list.findIndex(
    el => el.category.toLowerCase().trim() === category.toLowerCase().trim()
  );
  if (categoryIndex === -1) {
    activeShoppingList.list.push({ category: category.trim(), items: [] });

    categoryIndex = activeShoppingList.list.length - 1;
  }

  let itemIndex = activeShoppingList.list[categoryIndex].items.findIndex(
    item => item.name.toLowerCase().trim() === name.toLowerCase().trim()
  );
  if (itemIndex === -1) {
    activeShoppingList.list[categoryIndex].items.push({
      name: name.trim(),
      amount: 0,
      completed: false,
    });

    itemIndex = activeShoppingList.list[categoryIndex].items.length - 1;
  }

  const item = activeShoppingList.list[categoryIndex].items[itemIndex];
  item.amount = amount;
  item.completed = completed;

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
