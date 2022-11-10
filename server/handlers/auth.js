import {
  GetAuthToken,
  GetAccessToken,
  RefreshGoogleToken,
} from "../actions/auth.js";

export const RequestAuthToken = async (req, res) => {
  try {
    const data = await GetAuthToken(req.body.scope);
    return res.status(200).json({ data });
  } catch (err) {
    return res.status(500).json({ data: err.message });
  }
};

export const RequestAccessToken = async (req, res) => {
  try {
    const data = await GetAccessToken(req);
    return res.status(200).json({ data });
  } catch (err) {
    return res.status(500).json({ data: err.message });
  }
};

export const RefreshToken = async (req, res) => {
  try {
    const data = await RefreshGoogleToken(req);
    return res.status(200).json({ data });
  } catch (err) {
    return res.status(500).json({ data: err.message });
  }
};
