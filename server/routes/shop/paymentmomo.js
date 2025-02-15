const express = require("express");

const {
  paymentMomo,
} = require("../../controllers/shop/paymentMomo-controller");

const router = express.Router();

router.post("/payment", paymentMomo);
// router.post("/capture", capturePayment);
// router.get("/list/:userId", getAllOrdersByUser);
// router.get("/details/:id", getOrderDetails);

module.exports = router;
