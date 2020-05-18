require('dotenv').config();

const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const cors = require('cors');

const app = express();
const port = process.env.PORT;

const { newUser } = require('./controllers/user/new_user');
const { validateUser } = require('./controllers/user/validation');
const { loginUser } = require('./controllers/user/login');
const { getUser } = require('./controllers/user/user_data.js');
const { editUser } = require('./controllers/user/edit_user.js');
const { updatePassword } = require('./controllers/user/update_password');
const { userIsAuthenticated, userIsAdmin } = require('./middlewares/auth');
const { deleteUser } = require('./controllers/user/delete_user');
const { deactivateUser } = require('./controllers/user/deactivate_user');
const { newProduct } = require('./controllers/product/new_product');
const { productData } = require('./controllers/product/product_data');
const { editProduct } = require('./controllers/product/edit_product');

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(fileUpload());
app.use(cors());

//RUTAS USUARIO
app.post('/user', newUser); //crear nuevo usuario
app.post('/user/login', loginUser); //login usuario
app.get('/user/validate', validateUser); // validar usuario

app.put('/user/password/:id', userIsAuthenticated, updatePassword); // editar password usuario
//app.get('users'); lista usuarios
app.get('/user/:id', userIsAuthenticated, userIsAdmin, getUser); // obtener info usuario
app.put('/user/:id', userIsAuthenticated, userIsAdmin, editUser); // editar usuario
app.delete('/user/:id', userIsAuthenticated, userIsAdmin, deleteUser); //borrar usuario
app.put('/user/deactivate/:id', userIsAuthenticated, deactivateUser); //desactivar usuario

//RUTAS PRODUCTO
// app.get("/products");
app.post('/product', userIsAuthenticated, newProduct);
app.get('/product/:id', userIsAuthenticated, userIsAdmin, productData);
app.put('/product/:id', userIsAuthenticated, userIsAdmin, editProduct);
// app.delete("/products/:id");

/*//RUTAS VALORACIONES
app.post('/products/:id/rating');
app.get('/ratings'); //TOPFIVE

//RUTAS VISUALIZACIONES
app.get('/views');
app.get('/views/:increasing');
 */

// Error middleware
app.use((error, req, res, next) => {
  res.status(error.httpCode || 500).send({
    status: 'error',
    message: error.message
  });
});

app.use((req, res) => {
  res.status(404).send({
    status: 'error',
    message: '404 Not found'
  });
});
app.listen(port, () => {
  console.log(`Server working in port: ${port}`);
});
