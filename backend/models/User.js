const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");

const UserSchema = new mongoose.Schema(
  {
    uid: {
      type: String,
      unique: true,
      default: function () {
        return `usr_${uuidv4().replace(/-/g, "").slice(0, 16)}`;
      },
    },

    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [100, "Name cannot exceed 100 characters"],
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
    },

    company: {
      type: String,
      trim: true,
      maxlength: [100, "Company name cannot exceed 100 characters"],
      default: null,
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters"],
      select: false,
    },

    role: {
      type: String,
      enum: ["admin", "member", "viewer"],
      default: "member",
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    isEmailVerified: {
      type: Boolean,
      default: false,
    },

    passwordResetOtp: {
      type: String,
      select: false,
      default: null,
    },

    passwordResetOtpExpiry: {
      type: Date,
      select: false,
      default: null,
    },

    lastLogin: {
      type: Date,
      default: null,
    },

    loginCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

UserSchema.index({ company: 1 });

UserSchema.virtual("publicProfile").get(function () {
  return {
    uid: this.uid,
    fullName: this.fullName,
    email: this.email,
    company: this.company,
    role: this.role,
    isEmailVerified: this.isEmailVerified,
    lastLogin: this.lastLogin,
    createdAt: this.createdAt,
  };
});

UserSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

UserSchema.methods.recordLogin = async function () {
  this.lastLogin = new Date();
  this.loginCount += 1;
  await this.save({ validateBeforeSave: false });
};

module.exports = mongoose.model("User", UserSchema);