const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { sign } = require("jsonwebtoken");
const nodemailer = require('nodemailer')
const paginate = require('mongoose-paginate')
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: false
    },
    email: {
      unique: true,
      type: String,
      required: true,
      trim: true
    },
    password: {
      type: String,
      required: true,
      trim: true    
    },
    Isconfirmed:{ 
      type: Boolean,
      default: false 
    },
    dob: {
      type:String,
      trim:false
    },
    city: {
      type:String,
      trim:false
    },
    accessToken: {
      type: String,
      trim: true
    },
    movieInfo:[
      {
        movie_id:{
          type:String
        },
        movie_title:{
          type:String
        },
        rate:{
          type:String
        },
        Review:{
          type:String
        }
      }
    ]
  },
  { timestamps: true }
);

userSchema.statics.findByEmailAndPassword = async (email, password) => {
  try {
    const user = await User.findOne({ email: email });
    if (!user) throw new Error("Incorrect Credentials");
    const isMatched = await bcrypt.compare(password, user.password);
    if (!isMatched) throw new Error("Incorrect Credentials");
    return user;
  }
  catch (err) {
    err.name = "AuthError";
    throw err;
  }
};

userSchema.methods.generateToken =  function() {
  const user = this; 
 
    const accessToken =  sign({ id: user._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "12h"
    });
  user.accessToken = accessToken;
   user.save();
  return accessToken;
};
userSchema.methods.toJSON = function() {
  const user = this.toObject();
  delete user.password;
  delete user.accessToken;
  delete user.__v;
  // Super important
  return user;
};

// I should avoid rehashing the password twice.
userSchema.pre("save", async function(next) {
  const user = this;
  try {
    if (user.isModified("password")) {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      user.password = hashedPassword;
      next();
    }
  } catch (err) {
    console.log(err.message);
    next(err);
  }
});
userSchema.plugin(paginate)
const User = mongoose.model("user", userSchema);

module.exports = User;
