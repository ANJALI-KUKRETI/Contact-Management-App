const Contact = require("../models/contactModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("./../utils/appError");

exports.getAllContacts = catchAsync(async (req, res, next) => {
  const queryObj = { ...req.query };
  const allowed = ["name", "city", "state", "country", "category"];
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
  const newContact = await Contact.create(req.body);
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
  const contact = await Contact.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
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
