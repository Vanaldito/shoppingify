import express from "express";
import env from "./environment";
import { api } from "./src/routes";

const app = express();

app.use(express.json());

app.use("/api", api);

app.get("*", (_req, res) => {
  res.status(404).send("Error 404 ~ Page not found");
});

const PORT = env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log();
  console.log(`  App running in port ${PORT}`);

  if (env.NODE_ENV !== "production") {
    console.log();
    console.log(`  > Local: \x1b[36mhttp://localhost:\x1b[1m${PORT}/\x1b[0m`);
  }
});

export { app, server };
