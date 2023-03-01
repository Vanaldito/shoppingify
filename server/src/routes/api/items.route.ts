import { Router } from "express";
import { getUserIdFromToken, insertItemInItemsList } from "../../helpers";
import { User } from "../../models";

const items = Router();

items.get("/", async (req, res) => {
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

  return res.status(200).json({ status: 200, data: { items: user.items } });
});

items.post("/add", async (req, res) => {
  const cookies = req.cookies;
  const authToken = cookies["auth-token"];

  const id = getUserIdFromToken(authToken);

  if (id === undefined) {
    return res
      .status(401)
      .json({ status: 401, error: "Auth token is not valid" });
  }

  const { category, name } = req.body;
  let { note, image } = req.body;

  const categoryIsInvalid =
    typeof category !== "string" || category.trim() === "";
  if (categoryIsInvalid) {
    return res.status(400).json({
      status: 400,
      error: "Category is not valid",
    });
  }

  const nameIsInvalid = typeof name !== "string" || name.trim() === "";
  if (nameIsInvalid) {
    return res.status(400).json({
      status: 400,
      error: "Name is not valid",
    });
  }

  const noteIsInvalid = typeof note !== "string" || note.trim() === "";
  if (noteIsInvalid) {
    note = undefined;
  }

  const imageIsInvalid = typeof image !== "string" || image.trim() === "";
  if (imageIsInvalid) {
    image = undefined;
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

  const wasAdded = insertItemInItemsList(items, {
    category,
    name,
    image,
    note,
  });

  if (!wasAdded) {
    return res.status(409).json({ status: 409, error: "Item already exists" });
  }

  try {
    await User.updateItems(id, items);
  } catch (err) {
    console.log(err);

    return res
      .status(500)
      .json({ status: 500, error: "Internal server error" });
  }

  return res.status(200).json({ status: 200 });
});

items.post("/delete", async (req, res) => {
  const cookies = req.cookies;
  const authToken = cookies["auth-token"];

  const id = getUserIdFromToken(authToken);

  if (id === undefined) {
    return res
      .status(401)
      .json({ status: 401, error: "Auth token is not valid" });
  }

  const { category, name } = req.body;

  const categoryIsInvalid =
    typeof category !== "string" || category.trim() === "";
  if (categoryIsInvalid) {
    return res
      .status(400)
      .json({ status: 400, error: "Category is not valid" });
  }

  const nameIsInvalid = typeof name !== "string" || name.trim() === "";
  if (nameIsInvalid) {
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

  const items = user.items;

  const categoryIndex = items.findIndex(
    el => el.category.toLowerCase().trim() === category.toLowerCase().trim()
  );
  if (categoryIndex === -1) {
    return res
      .status(404)
      .json({ status: 404, error: "Item is not in the items list" });
  }

  const itemIndex = items[categoryIndex].items.findIndex(
    item => item.name.toLowerCase().trim() === name.toLowerCase().trim()
  );
  if (itemIndex === -1) {
    return res
      .status(404)
      .json({ status: 404, error: "Item is not in the items list" });
  }

  if (items[categoryIndex].items.length === 1) {
    items.splice(categoryIndex, 1);
  } else {
    items[categoryIndex].items.splice(itemIndex, 1);
  }

  await User.updateItems(id, items);

  return res.status(200).json({ status: 200 });
});

export default items;
