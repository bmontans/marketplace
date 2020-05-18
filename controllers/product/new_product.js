/*require("dotenv").config();
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
console.log("INTERNET!!!!");*/

require("dotenv").config();
const bcrypt = require("bcrypt");

const { getConnection } = require("../../db");
const { newProductSchema } = require("../../validations/product");
const { generateError } = require("../../helpers");

async function newProduct(req, res, next) {
  let connection;
  try {
    connection = await getConnection();
    await newProductSchema.validateAsync(req.body);

    const { name, description, price } = req.body;

    const [
      existingProduct,
    ] = await connection.query("SELECT pk_id FROM product WHERE name=?", [
      name,
    ]);
    if (existingProduct.length) {
      throw generateError("The product already exists in the DB", 409);
    }

    await connection.query(
      `INSERT INTO product (id_user, name, description, price, creation_date, modification_date)
      VALUES (?,?,?,?,NOW(),NOW()) `,
      [name, description, price]
    );

    res.send({
      status: "ok",
      message: "Product posted correctly.",
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) {
      connection.release();
    }
  }
}
module.exports = { newProduct };
console.log("Viva el JavaScript");
