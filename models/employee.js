
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const employeeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  position: {
    type: String,
    required: true
  },
  department: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  }
});

employeeSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ _id: this._id, name: this.name, email: this.email }, process.env.JWT_SECRET, {
    expiresIn: '24h'
  });
  return token;
};

module.exports = mongoose.model('Employee', employeeSchema);
