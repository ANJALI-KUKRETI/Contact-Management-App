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
    lowercase: true,
  },
  photo: {
    type: String,
  },
  cloudinary_id: {
    type: String,
  },
  phone: {
    type: Number,
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
  notes: {
    type: String,
    trim: true,
  },
  category: {
    type: String,
    enum: ["General", "Office", "Friends", "Relatives", "Important"],
    default: "General",
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false,
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: [true, "Contact must belong to a user"],
  },
});

const Contact = mongoose.model("Contact", contactSchema);
module.exports = Contact;
