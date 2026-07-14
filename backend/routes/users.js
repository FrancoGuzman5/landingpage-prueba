const express = require('express');
const router = express.Router();
const authorize = require("../middlewares/authorize");
const {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  changePassword
} = require('../controllers/usersController');

// Registro nuevo usuario (público)
router.post("/", createUser);

//Solo ADMIN
router.get("/", authorize("ADMIN"), getAllUsers);
router.get("/:id", authorize("ADMIN"), getUserById);
router.put("/:id", authorize("ADMIN"), updateUser);
router.delete("/:id", authorize("ADMIN"), deleteUser);
router.put("/:id/change-password", authorize("USER","ADMIN"), changePassword)

module.exports = router;
