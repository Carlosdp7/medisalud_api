const { validationResult } = require('express-validator');

const validateResult = (req, res, next) => {
  //Si hay errores del express validator
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }
  next();
}

module.exports = validateResult