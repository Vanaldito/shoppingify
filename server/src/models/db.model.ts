import { Client } from "pg";
import env from "../../environment";

const isNotValidPort =
  env.PG_PORT === undefined || isNaN(parseInt(env.PG_PORT));
const port = isNotValidPort ? undefined : parseInt(env.PG_PORT as string);

const db = new Client({
  host: env.PG_HOST,
  user: env.PG_USER,
  password: env.PG_PASSWORD,
  port,
});

db.connect()
  .then(() => console.log("Connected to database"))
  .catch(err => console.error(`Connection error ${err.stack}`));

export default db;
