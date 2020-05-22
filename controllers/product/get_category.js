require('dotenv').config();

const { getConnection } = require('../../db');
const { generateError } = require('../../helpers');

async function getCategory(req, res, next) {
  let connection;

  try {
    connection = await getConnection();
    const { tipo } = req.params;

    const [result] = await connection.query(
      `SELECT pk_id,
       name, 
       description, 
       price, 
       category
       FROM product 
       WHERE tipo=?`,
      [tipo]
    );

    if (!result.length) {
      throw generateError(
        `There are no products listed in this category: ${tipo}.`,
        404
      );
    }

    res.send({
      status: 'ok',
      data: result
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}
module.exports = { getCategory };
