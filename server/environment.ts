import dotenv from "dotenv";
import path from "path";

if (process.env.NODE_ENV !== undefined) {
  dotenv.config({
    path: path.join(__dirname, `.env.${process.env.NODE_ENV}.local`),
  });
  dotenv.config({
    path: path.join(__dirname, `.env.${process.env.NODE_ENV}`),
  });
}

dotenv.config({
  path: path.join(__dirname, `.env.local`),
});
dotenv.config();

const env = process.env;

export default env;
