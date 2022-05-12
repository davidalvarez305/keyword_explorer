import typeorm from "typeorm";
const getConnection = typeorm.getConnection;
import argon2 from "argon2";
import { COOKIE_NAME } from "../constants.js";

export const GetUser = async (username) => {
  return new Promise((resolve, reject) => {
    getConnection()
      .query(
        `SELECT username, email FROM manager WHERE username = '${username}'`
      )
      .then((user) => {
        if (user.length > 0) {
          resolve({
            user: user[0],
          });
        } else {
          resolve({
            error: "User not found.",
          });
        }
      })
      .catch((err) => {
        reject(err.message);
      });
  });
};

export const LoginUser = async (body) => {
  return new Promise((resolve, reject) => {
    getConnection().query(
        `SELECT * FROM manager WHERE username = '${body.username}'`
      ).then((user) => {
        if (user.length > 0) {
            const valid = await argon2.verify(user[0].password, body.password);
            if (valid) {
                resolve({
                user: user[0],
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
      }).catch((err) => {
          reject(err.message);
      })
  })
};

export const RegisterUser = async (body) => {
  try {
    const existingUsername = await getConnection().query(
      `SELECT * FROM manager WHERE username = '${body.username}'`
    );
    if (existingUsername.length > 0) {
      return {
        error: "Username already taken.",
      };
    }
    const existingEmail = await getConnection().query(
      `SELECT * FROM manager WHERE email = '${body.email}'`
    );
    if (existingEmail.length > 0) {
      return {
        error: "Email already taken.",
      };
    }
    const hashedPassword = await argon2.hash(body.password);
    await getConnection().query(
      `INSERT INTO manager (username, email, password) VALUES ('${body.username}', '${body.email}', '${hashedPassword}');
      `
    );
    const user = await getConnection().query(
      `SELECT * FROM manager WHERE username = '${body.username}';
        `
    );
    return {
      user: user[0],
    };
  } catch (error) {
    throw new Error(error.message);
  }
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
  try {
    const existingUser = await getConnection().query(
      `SELECT id, username FROM manager WHERE id = ${id}`
    );
    if (existingUser.length > 0) {
      return {
        user: existingUser[0],
      };
    } else {
      return {
        error: "User not found.",
      };
    }
  } catch (error) {
    throw new Error(error.message);
  }
};
