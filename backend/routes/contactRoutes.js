const express = require("express");
const contactController = require("../controllers/contactController");
const authController = require("../controllers/authController");

const router = express.Router();

router.use(authController.protect);

router.route("/make-private/:id").patch(contactController.makeContactSecret);
router
  .route("/remove-private/:id")
  .patch(contactController.removeContactSecret);

router
  .route("/")
  .get(contactController.getAllContacts)
  .post(contactController.createContact);

router
  .route("/:id")
  .get(contactController.getContact)
  .patch(contactController.updateContact)
  .delete(contactController.deleteContact);

module.exports = router;
