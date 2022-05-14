import axios from "axios";

export const GetAllKeywordsFromUrl = async (req, res) => {
  try {
    const { data } = await axios({
      url: `https://searchconsole.googleapis.com/webmasters/v3/sites/https%3A%2F%2F${req.body.site}/searchAnalytics/query?key=${process.env.API_KEY}`,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${req.session.access_token}`,
        Accept: "application/json",
      },
      data: {
        startDate: "2022-04-01",
        endDate: "2022-05-01",
        dimensions: ["query"],
      },
    });

    return res.status(200).json({ data });
  } catch (err) {
    return res.status(400).json({ data: err.message });
  }
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

export const GetAccountSites = async (req, res) => {
  return res.status(200).json({ data: "hey there!" });
};
