import { RequestAuthToken } from "../actions/auth.js";

export const RequestAuthToken = (req, res) => {
  RequestAuthToken()
    .then((token) => {
      return res.status(200).json({ data: token });
    })
    .catch((err) => {
      return res.status(500).json({ data: err.message });
    });
};

export const RequestAccessToken = async (req, res) => {
  GetAccessToken(req.code)
    .then((data) => {
      return res.status(200).json({ data });
    })
    .catch((err) => {
      return res.status(500).json({ data: err.message });
    });
};

export const RefreshToken = async (req, res) => {
  RefreshGoogleToken()
    .then((data) => {
      return res.status(200).json({ data });
    })
    .catch((err) => {
      return res.status(500).json({ data: err.message });
    });
};
