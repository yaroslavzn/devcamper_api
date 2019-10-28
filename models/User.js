const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a name.']
    },
    email: {
      type: String,
      match: [
        /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i,
        'Please enter a valid email'
      ],
      required: [true, 'Please add a mail.'],
      unique: [true, 'This email is already in use.']
    },
    password: {
      type: String,
      required: [true, 'Please add a password.'],
      minlength: 6,
      select: false
    },
    role: {
      type: String,
      enum: ['publisher', 'user'],
      default: 'user'
    },
    repeatPasswordToken: String,
    repeatPasswordExpire: Date
  },
  { timestamps: true }
);

// Password hash middleware
UserSchema.pre('save', async function(next) {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);

  next();
});

// Get generated JWT token
UserSchema.methods.getGeneratedJwt = function() {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};

// Match password
UserSchema.methods.matchPassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', UserSchema);
