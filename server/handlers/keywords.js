import { RequestAuthToken } from "../utils/keywords.js";

export const GetAllKeywordsFromUrl = async (req, res) => {

    const authToken = await RequestAuthToken();
    console.log(authToken)

    return res.status(200).json({ data: authToken });
}

export const GetPeopleAlsoAskQuestions = async (req, res) => {
    return res.status(200).json({ data: "hey there!" })
}

export const GetManyPAAQuestions = async (req, res) => {
    return res.status(200).json({ data: "hey there!" })
}

export const GetLowPickingsKeywords = async (req, res) => {
    return res.status(200).json({ data: "hey there!" })
}

export const GetStrikingDistanceKeywords = async (req, res) => {
    return res.status(200).json({ data: "hey there!" })
}