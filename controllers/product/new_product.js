/*require("dotenv").config();
const { getConnection } = require("../../database/db");

async function newProduct(req, res, next) {
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
module.exports = { newProduct };
console.log("INTERNET!!!!");*/

require('dotenv').config();

const { getConnection } = require('../../db');
const { newProductSchema } = require('../../validations/product');
const { generateError } = require('../../helpers');

async function newProduct(req, res, next) {
  let connection;
  try {
    const { id } = req.auth;
    connection = await getConnection();
    await newProductSchema.validateAsync(req.body);

    const { name, description, price } = req.body;

    const [
      existingProduct
    ] = await connection.query('SELECT name FROM product WHERE name=?', [name]);
    if (existingProduct.length) {
      throw generateError('The product already exists in the DB', 409);
    }

    await connection.query(
      `INSERT INTO product (id_user, name, description, price, creation_date, modification_date)
      VALUES (?,?,?,?,NOW(),NOW()) `,
      [id, name, description, price]
    );

    res.send({
      status: 'ok',
      message: 'Product posted correctly.'
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
console.log('Viva el JavaScript');

/*
require('dotenv').config();
const { getConnection } = require('../../db');
const { generateError } = require('../../helpers');
const { newProductSchema } = require('../../validations/product');

async function newProduct(req, res, next) {
  let connection;
  try {
    connection = await getConnection();
    await newProductSchema.validateAsync(req.body);
    console.log(req.body);

    const { name, description, price } = req.body;

    const { pk_id } = req.auth;

    const [
      current
    ] = await connection.query(` SELECT user_id FROM product WHERE user_id=?`, [
      pk_id
    ]);

    const [
      existingtitle
    ] = await connection.query('SELECT name FROM product WHERE name=?', [name]);
    if (existingtitle.length) {
      throw generateError('The product already exists in the DB', 409);
    }
    await connection.query(
      `INSERT INTO product (user_id, name, description, price, creation_date, modification_date) 
      VALUES  (?,?,?,?,NOW(),NOW())`,
      [name, description, price]
    );

    res.send({
      status: 'ok',
      message: 'Product has been listed in the marketplace.'
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
*/
