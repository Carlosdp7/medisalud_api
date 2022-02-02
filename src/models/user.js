const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');
const util = require('util');

const jwtSign = util.promisify(jwt.sign);

const userSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: true
  },
  lastname: {
    type: String,
    required: true
  },
  email: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true
  }
}, {
  timestamps: true,
  toJSON: {
    transform(doc, ret) {
      delete ret.password;
      delete ret.__v;
    }
  }
});

userSchema.statics.generateAuthToken = async (id) => {
  //Crear y firmar el JWT
  const payload = {
    user: {
      id: id
    }
  }

  //Firmar e JWT
  const token = await jwtSign(payload, process.env.JWT_SEED, {
    expiresIn: process.env.JWT_EXP
  })

  return token;
}

userSchema.statics.hashPassword = async (password) => {
  const salt = await bcryptjs.genSalt(10);
  const pass = await bcryptjs.hash(password, salt);

  return pass;
};

userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    const hashed = await User.hashPassword(this.get('password'));
    this.set('password', hashed);
  }

  next()
})

const User = mongoose.model('User', userSchema);

module.exports = User;