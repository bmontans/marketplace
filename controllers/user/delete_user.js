require("dotenv").config();
const { getConnection } = require("../../db");
const { generateError } = require("../../helpers");
async function deleteUser(req, res, next) {
  let connection;
  try {
    const { id } = req.params;

    connection = await getConnection();

    if (req.auth.role !== "admin") {
      throw generateError("Just administrator can do this", 400);
    }

    await connection.query("delete from user where pk_id=?", [id]);

    res.send({
      status: "ok",
      message: `Account with id ${id} has been succesfully deleted.`,
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) {
      connection.release();
    }
  }
}
module.exports = { deleteUser };
