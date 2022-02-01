const express = require('express');
const { body } = require('express-validator');

//Middlewares
const validateResult = require('../middlewares/validateResult');

//Controllers
const { signinUser, signupUser, updateUser, obtainAuthUser, logoutUser } = require('../controllers/user');
const auth = require('../middlewares/auth');

const router = express.Router();

router.get('/user/obtain-auth-user', auth, obtainAuthUser);

router.post('/user/signin', [
  body('email', 'Agrega un email valido').isEmail(),
  body('password', 'El password debe de ser minimo de 6 caracteres').isLength({ min: 6 })
], validateResult, signinUser);

router.post('/user/signup', auth, [
  body('firstname', 'El nombre es obligatorio').not().isEmpty().isString(),
  body('lastname', 'El apellido es obligatorio').not().isEmpty().isString(),
  body('email', 'Agrega un email valido').isEmail(),
  body('password', 'El password debe de ser minimo de 6 caracteres').isLength({ min: 6 })
], validateResult, signupUser);

router.post('/user/logout', auth, logoutUser);

router.put('/user/me', auth, [
  body('firstname')
    .if(body('firstname').exists())
    .isString(),
  body('lastname')
    .if(body('lastname').exists())
    .isString(),
  body('email')
    .if(body('email').exists())
    .isEmail(),
  body('password')
    .if(body('password').exists())
    .isLength({ min: 6 })
], validateResult, updateUser);

module.exports = router;