import {
  findUserById,
  GetUser,
  LoginUser,
  LogoutUser,
  RegisterUser,
} from "../actions/user.js";

export const Get = async (req, res) => {
  try {
    const getUser = await GetUser(req.params.username);
    if (getUser.user) {
      return res.status(200).json({ data: getUser.user });
    } else {
      return res.status(404).json({ data: getUser.error });
    }
  } catch (error) {
    return res.status(500).json({ data: error.message });
  }
};

export const Login = async (req, res) => {
  try {
    const loginAttempt = await LoginUser(req.body);
    if (loginAttempt.user) {
      req.session.userId = loginAttempt.user.id;
      const { password, ...user } = loginAttempt.user;
      return res.status(200).json({ data: { user } });
    } else {
      const { error } = loginAttempt;
      return res.status(400).json({ data: { error } });
    }
  } catch (error) {
    return res.status(500).json({ data: error.message });
  }
};

export const Register = async (req, res) => {
  try {
    const registerUser = await RegisterUser(req.body);
    if (registerUser.user) {
      req.session.userId = registerUser.user.id;
      const { user } = registerUser;
      return res.status(201).json({ data: { user } });
    } else {
      const { error } = registerUser;
      return res.status(400).json({ data: { error } });
    }
  } catch (error) {
    return res.status(500).json({ data: error.message });
  }
};

export const Logout = async (req, res) => {
  if (req.session.userId) {
    await LogoutUser(req, res)
      .then((response) => {
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
    try {
      const foundUser = await findUserById(req.session.userId);
      if (foundUser.user) {
        const user = foundUser.user.id;
        return res.status(200).json({ data: { user } });
      } else {
        const error = foundUser.error;
        return res.status(404).json({ data: { error } });
      }
    } catch (error) {
      return res.status(500).json({ data: error.message });
    }
  } else {
    return res.status(404).json({ data: { error: "Not logged in." } });
  }
};
