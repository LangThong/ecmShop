const express = require("express");

const {
  getAllOrdersOfAllUsers,
  getOrderDetailsForAdmin,
  updateOrderStatus,
  getRevenue,
  getBrandOfOrder,
  getCategoryOfOrder,
  getOrderFilter,
} = require("../../controllers/admin/order-controller");

const router = express.Router();

router.get("/get", getAllOrdersOfAllUsers);
router.post("/getOrderFilter", getOrderFilter);
router.get("/getRevenue", getRevenue);
router.get("/getBrandOfOrder", getBrandOfOrder);
router.get("/getCategoryOfOrder", getCategoryOfOrder);
router.get("/details/:id", getOrderDetailsForAdmin);
router.put("/update/:id", updateOrderStatus);

module.exports = router;
