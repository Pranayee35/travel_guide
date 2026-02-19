import express from "express";
import { auth } from "../middleware/auth.js";
import { admin } from "../middleware/admin.js";
import { getProfile, updateProfile, listUsers, updateUserByAdmin } from "../controllers/userController.js";

const router = express.Router();
router.get("/profile", auth, getProfile);
router.patch("/profile", auth, updateProfile);
router.get("/", auth, admin, listUsers);
router.patch("/:id", auth, admin, updateUserByAdmin);

export default router;
