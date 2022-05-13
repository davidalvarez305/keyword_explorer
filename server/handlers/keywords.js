export const GetAllKeywordsFromUrl = async (req, res) => {
  console.log(req.session.token)
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
