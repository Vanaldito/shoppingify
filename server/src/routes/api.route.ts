import { Router } from "express";
import { isValidEmailFormat } from "../helpers";
import { User } from "../models";

const api = Router();

api.post("/users/login", (req, res) => {
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

  const user = User.findByEmail(email.toLowerCase().trim());

  if (user === undefined || user.password !== password) {
    return res
      .status(401)
      .json({ status: 401, error: "Email or password incorrect" });
  }

  res.status(200).json({ status: 200 });
});

export default api;
