const express = require('express');
const { resultType, genderType } = require("../models/test");
const { body, param } = require('express-validator');

//Middlewares
const validateResult = require('../middlewares/validateResult');

//Controllers
const { obtainTests, obtainTest, createTest, updateTest, deleteTest } = require('../controllers/test');
const auth = require('../middlewares/auth');

const router = express.Router();

router.get('/test/obtain-tests', obtainTests);

router.get('/test/obtain-test/:id', [
  param('id')
    .isMongoId(),
], validateResult, obtainTest);

router.post('/test/create-test', auth, [
  body('firstname')
    .notEmpty()
    .withMessage('El nombre es requerido')
    .isString(),
  body('lastname')
    .notEmpty()
    .withMessage('El apellido es requerido')
    .isString(),
  body('phone')
    .notEmpty()
    .withMessage('El telefono es requerido')
    .isString(),
  body('age')
    .notEmpty()
    .withMessage('La edad es requerida')
    .isNumeric()
    .isInt(),
  body('gender')
    .notEmpty()
    .withMessage('El genero es requerido')
    .isIn(Object.values(genderType)),
  body('di')
    .notEmpty()
    .withMessage('CI/Pasaporte es requerido')
    .isString(),
  body('address')
    .notEmpty()
    .withMessage('La dirección es requerida')
    .isString(),
  body('result')
    .if(body('result').exists())
    .isBoolean(),
  body('time')
    .notEmpty()
    .withMessage('La hora es requerida')
    .isString(),
  body('admissionDate')
    .notEmpty()
    .withMessage('La fecha de ingreso es requerida')
    .isDate()
], validateResult, createTest);

router.put('/test/update-test/:id', auth, [
  param('id')
    .isMongoId(),
  body('firstname')
    .if(body('firstname').exists())
    .isString(),
  body('lastname')
    .if(body('lastname').exists())
    .isString(),
  body('phone')
    .if(body('phone').exists())
    .isString(),
  body('age')
    .if(body('age').exists())
    .isNumeric()
    .isInt(),
  body('gender')
    .if(body('gender').exists())
    .isIn(Object.values(genderType)),
  body('di')
    .if(body('di').exists())
    .isString(),
  body('address')
    .if(body('address').exists())
    .isString(),
  body('isValid')
    .if(body('isValid').exists())
    .isBoolean(),
  body('result')
    .if(body('result').exists())
    .isBoolean(),
  body('time')
    .if(body('time').exists())
    .isString(),
  body('admissionDate')
    .if(body('admissionDate').exists())
    .isDate()
], validateResult, updateTest);

router.delete('/test/delete-test/:id', auth, [
  param('id')
    .isMongoId(),
], validateResult, deleteTest);

module.exports = router;