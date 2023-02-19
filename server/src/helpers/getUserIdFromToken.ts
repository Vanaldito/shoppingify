import jwt from "jsonwebtoken";
import env from "../../environment";

export default function getUserIdFromToken<T>(authToken: T) {
  if (typeof authToken !== "string") {
    return undefined;
  }

  try {
    const id = (
      jwt.verify(authToken, env.JWT_SECRET as string) as { id: number }
    ).id;

    return id;
  } catch {
    return undefined;
  }
}
