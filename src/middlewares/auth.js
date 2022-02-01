const User = require('../models/user');
const jwt = require('jsonwebtoken');

const auth = async (req, res, next) => {
  try {
    const authHead = req.header('Authorization');
    const hasBearer = authHead.includes('Bearer ');

    if (!hasBearer) {
      res.status(403).send({
        err: "No autorizado"
      })
      return;
    }

    const token = authHead.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SEED);

    const user = await User.findOne({
      _id: decoded.user.id,
    });

    if (!user) {
      res.status(403).send({
        err: "No autorizado"
      })
      return;
    }

    req.user = {
      id: user._id
    }
    next()
  } catch (e) {
    res.status(401).send({
      err: 'No autorizado'
    })
  }
}

module.exports = auth