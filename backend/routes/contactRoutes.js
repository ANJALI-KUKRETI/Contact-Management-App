const express = require("express");
const contactController = require("../controllers/contactController");
const authController = require("../controllers/authController");
const upload = require("../utils/multer");
const router = express.Router();

router.use(authController.protect);

router.route("/make-private/:id").patch(contactController.makeContactSecret);
router
  .route("/remove-private/:id")
  .patch(contactController.removeContactSecret);

router
  .route("/")
  .get(contactController.getAllContacts)
  .post(upload.single("photo"), contactController.createContact);

router
  .route("/:id")
  .get(contactController.getContact)
  .patch(upload.single("photo"), contactController.updateContact)
  .delete(contactController.deleteContact);

module.exports = router;
