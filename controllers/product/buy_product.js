require('dotenv').config();
const { getConnection } = require('../../db');
const { buyProductSchema } = require('../../validations/buy_product');
const { generateError } = require('../../helpers');

async function buyProduct(req, res, next) {
  let connection;

  try {
    connection = await getConnection();
    await buyProductSchema.validateAsync(req.body);

    const id_user = req.auth.id;
    const id_product = req.params.id;

    const {
      precio,
      direccion,
      fecha_envio,
      fecha_inicio,
      fecha_fin
    } = req.body;

    if (id_user !== req.auth.id) {
      throw generateError(
        'You must create an account or login with an existing account in order to buy this product.',
        401
      );
    }
    await connection.query(
      `INSERT INTO transactions (id_user, id_product, description, rating, fecha_envio, fecha_inicio, fecha_fin) 
      VALUES  (?,?,?,?,?,?,?)`,

      [
        id_user,
        id_product,
        description,
        direccion,
        fecha_envio,
        fecha_inicio,
        fecha_fin
      ]
    );

    res.send({
      status: 'ok',
      message:
        'You have successfully bought this product. A confirmation email has been sent to your inbox.'
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) {
      connection.release();
    }
  }
}
module.exports = { buyProduct };
