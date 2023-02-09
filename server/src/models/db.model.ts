import { Client } from "pg";
import env from "../../environment";

let port;
try {
  port = env.PG_PORT === undefined ? undefined : parseInt(env.PG_PORT);
} catch {
  port = undefined;
}

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
