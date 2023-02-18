import { Router } from "express";
import jwt from "jsonwebtoken";
import env from "../../../environment";
import { User } from "../../models";

const items = Router();

items.get("/", async (req, res) => {
  const cookies = req.cookies;
  const authToken = cookies["auth-token"];

  if (typeof authToken !== "string") {
    return res
      .status(401)
      .json({ status: 401, error: "Auth token is not valid" });
  }

  let id: number;
  try {
    id = (jwt.verify(authToken, env.JWT_SECRET as string) as { id: number }).id;
  } catch {
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

  if (typeof authToken !== "string") {
    return res
      .status(401)
      .json({ status: 401, error: "Auth token is not valid" });
  }

  let id;
  try {
    id = (jwt.verify(authToken, env.JWT_SECRET as string) as { id: number }).id;
  } catch {
    return res
      .status(401)
      .json({ status: 401, error: "Auth token is not valid" });
  }

  const { category, name } = req.body;
  let { note, image } = req.body;

  if (typeof category !== "string" || category.trim() === "") {
    return res.status(400).json({
      status: 400,
      error: "Category is not valid",
    });
  }

  if (typeof name !== "string" || name.trim() === "") {
    return res.status(400).json({
      status: 400,
      error: "Name is not valid",
    });
  }

  if (typeof note !== "string" || note.trim() === "") {
    note = undefined;
  }

  if (typeof image !== "string" || image.trim() === "") {
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

  const categoryIndex = items.findIndex(
    el => el.category.toLowerCase().trim() === category.toLowerCase().trim()
  );

  if (categoryIndex === -1) {
    items.push({
      category: category.trim(),
      items: [{ name: name.trim(), note: note?.trim(), image: image?.trim() }],
    });
  } else {
    const itemIndex = items[categoryIndex].items.findIndex(
      item => item.name.toLowerCase().trim() === name.toLowerCase().trim()
    );

    if (itemIndex !== -1) {
      return res
        .status(409)
        .json({ status: 409, error: "Item already exists" });
    }

    items[categoryIndex].items.push({
      name: name.trim(),
      note: note?.trim(),
      image: image?.trim(),
    });
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

export default items;
