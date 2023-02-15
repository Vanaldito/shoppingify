import bcrypt from "bcrypt";
import { Router } from "express";
import jwt from "jsonwebtoken";
import { DatabaseError } from "pg";
import env from "../../environment";
import { isValidEmailFormat } from "../helpers";
import { User } from "../models";

const api = Router();

api.post("/users/register", async (req, res) => {
  const { email, password } = req.body;

  const emailIsNotValid =
    typeof email !== "string" ||
    email.trim() === "" ||
    !isValidEmailFormat(email.trim());

  if (emailIsNotValid) {
    return res.status(400).json({ status: 400, error: "Email is not valid" });
  }

  const passwordIsNotValid =
    typeof password !== "string" || password.trim() === "";

  if (passwordIsNotValid) {
    return res
      .status(400)
      .json({ status: 400, error: "Password is not valid" });
  }

  let user;
  try {
    const saltRounds = 10;
    user = await User.save({
      email: email.trim().toLowerCase(),
      password: bcrypt.hashSync(password, saltRounds),
      items: [],
      activeShoppingList: { name: `default--${Date.now()}`, list: [] },
      shoppingHistory: [],
    });
  } catch (err) {
    if (
      err instanceof DatabaseError &&
      err.message ===
        'duplicate key value violates unique constraint "users_email_key"'
    ) {
      return res
        .status(409)
        .json({ status: 409, error: "Email is already used" });
    }

    console.log(`/api/users/register ~ Error: ${err}`);
    return res
      .status(500)
      .json({ status: 500, error: "Internal server error" });
  }

  return res
    .status(200)
    .cookie("auth-token", jwt.sign({ id: user.id }, env.JWT_SECRET as string))
    .json({ status: 200 });
});

api.post("/users/login", async (req, res) => {
  const { email, password } = req.body;

  const emailIsNotValid =
    typeof email !== "string" ||
    email.trim() === "" ||
    !isValidEmailFormat(email.trim());

  if (emailIsNotValid) {
    return res.status(400).json({ status: 400, error: "Email is not valid" });
  }

  const passwordIsNotValid =
    typeof password !== "string" || password.trim() === "";

  if (passwordIsNotValid) {
    return res
      .status(400)
      .json({ status: 400, error: "Password is not valid" });
  }

  let user;
  try {
    user = await User.findByEmail(email.toLowerCase().trim());
  } catch (err) {
    console.log(`/api/users/login ~ Error: ${err}`);
    return res
      .status(500)
      .json({ status: 500, error: "Internal server error" });
  }

  if (user === undefined || !bcrypt.compareSync(password, user.password)) {
    return res
      .status(401)
      .json({ status: 401, error: "Email or password incorrect" });
  }

  res
    .status(200)
    .cookie("auth-token", jwt.sign({ id: user.id }, env.JWT_SECRET as string))
    .json({ status: 200 });
});

export default api;
