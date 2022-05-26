import * as ExpressAPI from "../util/express_api_util";

export const fetchScore = (difficulty) => {
  return ExpressAPI.fetchApiData(`score/${difficulty}`);
};

export const addScore = (score, username, difficulty) => {
  return ExpressAPI.fetchApiData(`score`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      score: score,
      username: username,
      difficulty: difficulty
    }),
  });
};