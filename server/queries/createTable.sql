CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  items TEXT NOT NULL,
  activeShoppingList TEXT NOT NULL,
  shoppingHistory TEXT NOT NULL
);