require("dotenv").config();
const { getConnection } = require("../../database/db");

async function newPresentation(req, res, next) {
  let connection;
  try {
    connection = await getConnection();
    ///////OCURREN MOVIDAS///////
    res.send({
      status: "ok",
      message: "Product placed in the market properly",
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) {
      connection.release();
    }
  }
}
module.exports = { newPresentation };
console.log("INTERNET!!!!");
