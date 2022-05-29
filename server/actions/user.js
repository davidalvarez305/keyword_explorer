import typeorm from "typeorm";
const getConnection = typeorm.getConnection;
import argon2 from "argon2";
import { COOKIE_NAME } from "../constants.js";
import { AppDataSource } from "../database/db.js";
import { UserColumns } from "../models/user.js";

const User = AppDataSource.getRepository(UserColumns);

export const GetUser = async (username) => {
  return new Promise((resolve, reject) => {
    User.findOneBy({ username: username })
      .then((user) => {
        if (user) {
          resolve({
            user,
          });
        } else {
          resolve({
            error: "User not found.",
          });
        }
      })
      .catch((err) => {
        console.error(err);
        reject(err.message);
      });
  });
};

export const LoginUser = async (body) => {
  return new Promise((resolve, reject) => {
    User.findOneBy({ username: body.username })
      .then(async (user) => {
        if (user) {
          console.log(user);
          const valid = await argon2.verify(user.password, body.password);
          if (valid) {
            resolve({
              user,
            });
          } else {
            resolve({
              error: "Incorrect password.",
            });
          }
        } else {
          resolve({
            error: "Username not found.",
          });
        }
      })
      .catch((err) => {
        console.error(err);
        reject(err.message);
      });
  });
};

export const RegisterUser = async (body) => {
  return new Promise((resolve, reject) => {
    // Check for existing username
    User.findOneBy({ username: body.username })
      .then((existingUsername) => {
        if (existingUsername) {
          resolve({
            error: "Username already taken.",
          });
        }
      })
      .catch((err) => {
        console.error(err);
        reject(err.message);
      });

    // Check for existing e-mail
    User.findOneBy({ email: body.email })
      .then((existingEmail) => {
        if (existingEmail) {
          resolve({
            error: "Email already taken.",
          });
        }
      })
      .catch((err) => {
        console.error(err);
        reject(err.message);
      });

    // Hash password and create User
    argon2
      .hash(body.password)
      .then((hashedPassword) => {
        if (hashedPassword) {
          let newUser = {
            ...body,
            password: hashedPassword,
          };
          User.save(newUser)
            .then((user) => {
              resolve({
                user,
              });
            })
            .catch((err) => {
              console.error(err);
              reject(err.message);
            });
        }
      })
      .catch((err) => {
        console.error(err);
        reject(err.message);
      });
  });
};

export const LogoutUser = async (req, res) => {
  return new Promise((resolve) => {
    req.session.destroy((err) => {
      res.clearCookie(COOKIE_NAME);
      if (err) {
        resolve(false);
        return;
      }
      resolve(true);
    });
  });
};

export const findUserById = async (id) => {
  return new Promise((resolve, reject) => {
    User.findOneBy({ id })
      .then((user) => {
        resolve({
          user,
        });
      })
      .catch((err) => {
        console.error(err);
        reject(err.message);
      });
  });
};

export const UpdateUserCredentials = async (input) => {
  const { id, ...fields } = input;
  return new Promise(async (resolve, reject) => {
    try {
      const u = await User.findOneBy({ id });
      u.semrush_api_key = fields.semrush_api_key;
      u.serp_api_key = fields.serp_api_key;
      User.save(u)
        .then((user) => {
          resolve({ user });
        })
        .catch(reject);
    } catch (err) {
      reject(err);
    }
  });
};
