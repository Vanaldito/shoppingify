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

export default items;
