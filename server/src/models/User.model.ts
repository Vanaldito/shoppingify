export const users: UserData[] = [];

interface UserData {
  email: string;
  password: string;
}

export default class User {
  email: string;
  password: string;

  constructor({ email, password }: UserData) {
    this.email = email;
    this.password = password;
  }

  public save() {
    users.push({ email: this.email, password: this.password });
  }

  static findByEmail(email: string) {
    return users.find(user => user.email === email);
  }
}
