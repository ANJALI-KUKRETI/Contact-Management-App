const Contact = require("../models/contactModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("./../utils/appError");
const cloudinary = require("../utils/cloudinary");

exports.getAllContacts = catchAsync(async (req, res, next) => {
  console.log(req.user._id);
  const queryObj = { ...req.query, user: req.user._id };
  // const allowed = ["name", "city", "state", "country", "category"];
  const notAllowed = ["createdAt", "secret", "phone", "photo", "email"];

  for (let key in queryObj) {
    if (notAllowed.includes(key)) {
      return next(
        new AppError(
          `The parameter ${key} is not available for searching.`,
          400
        )
      );
    }
  }
  const contacts = Contact.find(queryObj);
  contacts.sort("-createdAt");
  const final = await contacts.select("-__v");
  res.status(200).json({
    status: "success",
    results: final.length,
    data: {
      contacts: final,
    },
  });
});

exports.createContact = catchAsync(async (req, res, next) => {
  if (!req.body.user) req.body.user = req.user._id;
  let response;
  if (req.file) response = await cloudinary.uploader.upload(req.file.path);
  const body = req.file
    ? {
        ...req.body,
        photo: response.secure_url,
        cloudinary_id: response.public_id,
      }
    : {
        ...req.body,
      };
  const newContact = await Contact.create(body);
  res.status(201).json({
    status: "success",
    data: {
      newContact,
    },
  });
});

exports.getContact = catchAsync(async (req, res, next) => {
  const contact = await Contact.findById(req.params.id);
  if (!contact) {
    return next(new AppError("No tour found with that ID", 404));
  }
  res.status(200).json({
    status: "success",
    data: {
      contact,
    },
  });
});

exports.updateContact = catchAsync(async (req, res, next) => {
  let body, response;
  const contact = await Contact.findById(req.params.id);
  if (!contact) {
    return next(new AppError("No tour found with that ID", 404));
  }
  if (req.file) {
    if (contact.cloudinary_id) {
      await cloudinary.uploader.destroy(contact.cloudinary_id);
      response = await cloudinary.uploader.upload(req.file.path);
      body = {
        photo: response.secure_url,
        cloudinary_id: response.public_id,
      };
    } else {
      body = contact.cloudinary_id
        ? {
            ...req.body,
            photo: contact.photo,
          }
        : {
            ...req.body,
          };
    }
  }
  const updatedContact = await Contact.findByIdAndUpdate(req.params.id, body, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    status: "success",
    data: {
      updatedContact,
    },
  });
});

exports.deleteContact = catchAsync(async (req, res, next) => {
  const contact = await Contact.findByIdAndDelete(req.params.id);
  if (!contact) {
    return next(new AppError("No tour found with that ID", 404));
  }
  res.status(204).json({
    status: "success",
    data: null,
  });
});

exports.makeContactSecret = catchAsync(async (req, res, next) => {
  const contact = await Contact.findByIdAndUpdate(
    req.params.id,
    { secret: true },
    { new: true }
  );
  if (!contact) {
    return next(new AppError("No tour found with that ID", 404));
  }
  res.status(200).json({
    status: "success",
    data: contact,
  });
});
exports.removeContactSecret = catchAsync(async (req, res, next) => {
  const contact = await Contact.findByIdAndUpdate(
    req.params.id,
    { secret: false },
    { new: true }
  );
  if (!contact) {
    return next(new AppError("No tour found with that ID", 404));
  }
  res.status(200).json({
    status: "success",
    data: contact,
  });
});
