import {
  findUserById,
  GetUser,
  LoginUser,
  LogoutUser,
  RegisterUser,
} from "../actions/user.js";

export const Get = async (req, res) => {
  GetUser(req.params.username)
    .then((u) => {
      if (u.user) {
        return res.status(200).json({ data: u.user });
      } else {
        return res.status(404).json({ data: u.error });
      }
    })
    .catch((error) => {
      return res.status(500).json({ data: error.message });
    });
};

export const Login = async (req, res) => {
  LoginUser(req.body)
    .then((loginAttempt) => {
      if (loginAttempt.user) {
        req.session.userId = loginAttempt.user.id;
        const { password, ...user } = loginAttempt.user;
        return res.status(200).json({ data: { user } });
      } else {
        const { error } = loginAttempt;
        return res.status(400).json({ data: { error } });
      }
    })
    .catch((err) => {
      return res.status(500).json({ data: err.message });
    });
};

export const Register = async (req, res) => {
  RegisterUser(req.body)
    .then((registeredUser) => {
      if (registeredUser.user) {
        req.session.userId = registeredUser.user.id;
        const { user } = registeredUser;
        return res.status(201).json({ data: { user } });
      } else {
        const { error } = registeredUser;
        return res.status(400).json({ data: { error } });
      }
    })
    .catch((error) => {
      return res.status(500).json({ data: error.message });
    });
};

export const Logout = async (req, res) => {
  if (req.session.userId) {
    await LogoutUser(req, res)
      .then((_) => {
        return res.status(200).json({ data: true });
      })
      .catch((error) => {
        return res.status(500).json({ data: error.message });
      });
  } else {
    return res.status(404).json({ data: "Invalid operation." });
  }
};

export const Me = async (req, res) => {
  if (req.session.userId) {
    findUserById(req.session.userId)
      .then((foundUser) => {
        if (foundUser.user) {
          const user = foundUser.user.id;
          return res.status(200).json({ data: { user } });
        } else {
          const error = foundUser.error;
          return res.status(404).json({ data: { error } });
        }
      })
      .catch((error) => {
        console.error(error)
        return res.status(500).json({ data: error.message });
      });
  } else {
    return res.status(404).json({ data: { error: "Not logged in." } });
  }
};
