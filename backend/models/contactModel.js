const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: [true, "A contact must have a name"],
  },
  email: {
    type: String,
    unique: true,
    lowercase: true,
  },
  photo: {
    type: String,
  },
  phone: {
    type: Number,
    unique: true,
    validate: /^$|^\d{10}$/,
    required: [true, "Please enter the mobile number"],
  },
  secret: {
    type: Boolean,
    default: false,
  },
  address: {
    type: String,
  },
  city: String,
  state: String,
  country: String,
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false,
  },
  category: {
    type: String,
    enum: ["general", "office", "friends", "relatives", "importants", "others"],
    default: "others",
  },
});

const Contact = mongoose.model("Contact", contactSchema);
module.exports = Contact;
