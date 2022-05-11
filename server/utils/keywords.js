import axios from "axios";
import { GOOGLE_REFRESH_TOKEN, GOOGLE_ADS_SCOPE, __prod__ } from "../../utils/constants.js";

export const RequestAuthToken = () => {
  return new Promise((resolve, reject) => {
    axios
      .post(config.auth_uri, null, {
        params: {
          access_type: "offline",
          approval_prompt: "force",
          scope: GOOGLE_ADS_SCOPE,
          client_id: config.oauth_client_id,
          redirect_uri: __prod__
            ? config.redirect_uris[0]
            : config.redirect_uris[1],
          response_type: "code",
        },
      })
      .then((final) => {
        resolve(final.request._redirectable._currentUrl);
      })
      .catch(reject);
  });
};

export const RefreshGoogleToken = () => {
  return new Promise((resolve, reject) => {
    axios
      .post(config.token_uri, null, {
        params: {
          client_secret: config.oauth_client_secret,
          client_id: config.oauth_client_id,
          refresh_token: GOOGLE_REFRESH_TOKEN,
          grant_type: "refresh_token",
        },
      })
      .then((data) => {
        resolve(data.data);
      })
      .catch((e) => {
        if (__prod__) {
          reject(e.message);
        } else {
          reject(e);
        }
      });
  });
};

export const GetAccessToken = async (code) => {
  return new Promise((resolve, reject) => {
    axios
      .post(config.token_uri, null, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        params: {
          code: code,
          client_id: config.oauth_client_id,
          client_secret: config.oauth_client_secret,
          redirect_uri: __prod__
            ? config.redirect_uris[0]
            : config.redirect_uris[1],
          scope: GOOGLE_ADS_SCOPE,
          grant_type: "authorization_code",
        },
      })
      .then((data) => {
        console.log("token: ", data);
        resolve(data.data);
      })
      .catch((e) => {
        if (__prod__) {
          reject(e.message);
        } else {
          reject(e);
        }
      });
  });
};
