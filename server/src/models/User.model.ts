import db from "./db.model";

interface UserData {
  email: string;
  password: string;
}

interface DatabaseUserRow extends UserData {
  id: number;
}

export default class User {
  email: string;
  password: string;

  constructor({ email, password }: UserData) {
    this.email = email;
    this.password = password;
  }

  public async save() {
    await db.query("INSERT INTO users (email, password) VALUES ($1, $2)", [
      this.email,
      this.password,
    ]);

    return true;
  }

  static async findByEmail(email: string) {
    const dbResult = await db.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    const users = dbResult.rows as DatabaseUserRow[];

    if (users.length === 0) {
      return undefined;
    }

    return users[0];
  }
}
