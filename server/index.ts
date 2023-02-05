import express from "express";

const app = express();

app.get("*", (_req, res) => {
  res.status(404).send("Error 404 ~ Page not found");
});

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log();
  console.log(`  App running in port ${PORT}`);

  if (process.env.NODE_ENV !== "production") {
    console.log();
    console.log(`  > Local: \x1b[36mhttp://localhost:\x1b[1m${PORT}/\x1b[0m`);
  }
});

export { app, server };
