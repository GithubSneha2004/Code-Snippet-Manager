const { Schema, model } = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    role : {
      type: String,
      enum:['professor','student'],
      default: 'professor',
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/.+@.+\..+/, 'Must use a valid email address'],
    },
    password: {
  type: String,
  required: true,
  validate: {
    validator: function (value) {
      const lengthCheck = value.length >= 8;
      const upperCheck = /[A-Z]/.test(value);
      const lowerCheck = /[a-z]/.test(value);
      const numberCheck = /\d/.test(value);
      const specialCheck = /[!@#$%^&*(),.?":{}|<>]/.test(value);
      return lengthCheck && upperCheck && lowerCheck && numberCheck && specialCheck;
    },
    message:
      'Password must be at least 8 characters and include uppercase, lowercase, number, and special character.',
  },
},

    savedSnippets: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Snippet',
      },
    ],
  },
  {
    toJSON: {
      virtuals: true,
    },
  }
);


// Hash password
userSchema.pre('save', async function (next) {
  if (this.isNew || this.isModified('password')) {
    const saltRounds = 10;
    this.password = await bcrypt.hash(this.password, saltRounds);
  }
  next();
});

// Password validation method
userSchema.methods.isCorrectPassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

const User = model('User', userSchema);

module.exports = User;
