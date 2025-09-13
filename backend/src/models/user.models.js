import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      minlength: 6,
      required: [true, "password must be 6 Character long"],
    },

    fullname: {
      firstname:{
        type: String,
        required: true,
        trim: true,
        index: true,
      },
      lastname:{
        type: String,
        trim: true,
      }
    },

    phoneNumber:{
        type: String,
        required: true,
        sparse: true, // optional at registration
        match: /^[6-9]\d{9}$/  // Indian phone number format
    },

    avatar: {
      type: String, // Cloudinary URL
      required: false,
    },

    refreshToken: {
      type: String,
    },

    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },

    cart: { type: Schema.Types.ObjectId, ref: 'Cart' },
    orders: [{ type: Schema.Types.ObjectId, ref: 'Order' }],
    reviews: [{ type: Schema.Types.ObjectId, ref: 'Review' }]
  },
  
  { timestamps: true }
);


// Hash password before saving
userSchema.pre("save", async function (next) {
    if(!this.isModified("password")) return next()
        this.password = await bcrypt.hash(this.password, 10)
    next()
})

userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateAccessToken = function () {
  //short lived access token JWT
  return jwt.sign({
    _id: this._id,
    email: this.email,
    username: this.username,
    fullname: this.fullname,
    role: this.role, // helpful for frontend/admin checks
  },
  process.env.ACCESS_TOKEN_SECRET,
  { expiresIn: process.env.ACCESS_TOKEN_EXPIRY });
}

userSchema.methods.generateRefreshToken = function () {
  //short lived access token JWT
  return jwt.sign({
    _id: this._id
  },
  process.env.REFRESH_TOKEN_SECRET,
  { expiresIn: process.env.REFRESH_TOKEN_EXPIRY });
}

export const User = mongoose.model("User", userSchema)
