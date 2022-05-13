import axios from "axios";
import * as config from "../google.json";
import { __prod__, REDIRECT_URI } from "../constants.js";
import { AppDataSource } from "../database/db.js";
import { UserColumns } from "../models/user.js";

const User = AppDataSource.getRepository(UserColumns);

export const GetAuthToken = (scope) => {
  return new Promise((resolve, reject) => {
    axios
      .post(config.default.web.auth_uri, null, {
        params: {
          access_type: "offline",
          approval_prompt: "force",
          scope: scope,
          client_id: config.default.web.client_id,
          redirect_uri: REDIRECT_URI,
          response_type: "code",
        },
      })
      .then((final) => {
        resolve(final.request._redirectable._currentUrl);
      })
      .catch(reject);
  });
};

export const GetAccessToken = async (body) => {
  return new Promise((resolve, reject) => {
    axios
      .post(config.default.web.token_uri, null, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        params: {
          code: body.code,
          client_id: config.default.web.client_id,
          client_secret: config.default.web.client_secret,
          redirect_uri: REDIRECT_URI,
          scope: body.scope,
          grant_type: "authorization_code",
        },
      })
      .then((data) => {
        console.log(req.session)
        // Persist data to Cookie
        req.session.refresh_token = data.data.refresh_token;
        req.session.access_token = data.data.access_token;
        req.session.lastRequest = Date.now();

        // Persist data to Database
        User.findOneBy({ id: req.session.userId })
          .then((u) => {
            u.refresh_token = data.data.refresh_token;
            u.save();
          })
          .catch((err) => {
            console.error("Failed to persist refresh token to user database.");
            reject(err);
          });
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

export const RefreshGoogleToken = () => {
  return new Promise((resolve, reject) => {
    axios
      .post(config.default.web.token_uri, null, {
        params: {
          client_secret: config.default.web.oauth_client_secret,
          client_id: config.default.web.client_id,
          refresh_token: GOOGLE_REFRESH_TOKEN,
          grant_type: "refresh_token",
        },
      })
      .then((data) => {
        // Add logic for appending a temprary access token to the user which will be used for requests.
        // Create logic for whenever user requests fail because of access token to refresh
        // Automatically detect if it's been more than 1 hour.
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
