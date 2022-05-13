import { EntitySchema } from "typeorm";

class User {
  constructor(id, username, password, email) {
    this.id = id;
    this.username = username;
    this.password = password;
    this.email = email;
  }
}
export const UserColumns = new EntitySchema({
  name: "User",
  target: User,
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },
    username: {
      unique: true,
      type: "varchar",
    },
    password: {
      type: "varchar",
    },
    email: {
      unique: true,
      type: "varchar",
    },
    refresh_token: {
      unique: true,
      type: "varchar",
      nullable: true,
      default: null,
    },
  },
});
