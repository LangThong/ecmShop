const express = require("express");

const {
  createUser,
  getUsers,
  removeUser,
  getUser,
  updateUser,
} = require("../../controllers/admin/users-controller");

const router = express.Router();

router.post("/add", createUser);
router.delete("/remove/:id", removeUser);
router.get("/get", getUsers);
router.get("/detail/:id", getUser);
router.put("/update/:id", updateUser);

module.exports = router;
