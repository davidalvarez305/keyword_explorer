import { RefreshGoogleToken } from "../actions/auth.js";

export const GetAllKeywordsFromUrl = async (req, res) => {
  let token = "";

  if ((Date.now() - req.session.lastRequest) / 1000 < 3600) {
    token = req.session.access_token;
  } else {
    RefreshGoogleToken(req)
      .then((data) => {
        token = data.access_token;
      })
      .catch((err) => {
        return res.status(400).json({ data: err.message });
      });
  }

  return res.status(200).json({ data: "hey there!" });
};

export const GetPeopleAlsoAskQuestions = async (req, res) => {
  return res.status(200).json({ data: "hey there!" });
};

export const GetManyPAAQuestions = async (req, res) => {
  return res.status(200).json({ data: "hey there!" });
};

export const GetLowPickingsKeywords = async (req, res) => {
  return res.status(200).json({ data: "hey there!" });
};

export const GetStrikingDistanceKeywords = async (req, res) => {
  return res.status(200).json({ data: "hey there!" });
};
