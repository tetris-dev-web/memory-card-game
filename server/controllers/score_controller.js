const path = require("path");
const AppDAO = require('../db_util/dao')
const dao = new AppDAO(path.resolve(__dirname, '../storage/db.sqlite3'))

const getScore = async (difficulty) => {
  return dao.all(`SELECT * FROM top_score WHERE difficulty = ? ORDER BY score DESC`,
  [difficulty])
}

const getScoreAll = async () => {
  return await dao.all(`SELECT * FROM top_score ORDER BY score DESC`)
}

const saveScore = async (score, username, difficulty) => {
  return await dao.run(
    `INSERT INTO top_score (username, score, difficulty, date)
      VALUES (?, ?, ?, ?)`,
    [username, score, difficulty, Date.now()])
}

module.exports = {
  getScore,
  getScoreAll,
  saveScore,
};