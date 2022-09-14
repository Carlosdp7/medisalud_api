const mongoose = require('mongoose');

const genderType = {
  Male: 'M',
  Female: 'F'
}

const testSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: true
  },
  lastname: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  age: {
    type: Number,
    required: true
  },
  gender: {
    type: String,
    required: true,
    enum: Object.values(genderType)
  },
  di: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  result: {
    type: Boolean,
    required: false,
    default: null
  },
  qrcode: {
    type: String,
    required: false
  },
  isValid: {
    type: Boolean,
    default: true
  },
  isDelete: {
    type: Boolean,
    default: false
  },
  time: {
    type: String,
    required: true
  },
  admissionDate: {
    type: mongoose.Schema.Types.Date,
    required: true
  }
}, {
  timestamps: true,
  toJSON: {
    transform(doc, ret) {
      delete ret.__v;
    }
  }
});

const Test = mongoose.model('Test', testSchema);

module.exports = { Test, genderType };