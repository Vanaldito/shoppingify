import { Router } from "express";
import { getUserIdFromToken } from "../../helpers";
import { User } from "../../models";

const shoppingHistory = Router();

shoppingHistory.get("/", async (req, res) => {
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

  const { shoppingHistory } = user;

  return res.status(200).json({ status: 200, data: { shoppingHistory } });
});

export default shoppingHistory;
