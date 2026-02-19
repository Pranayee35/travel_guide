import express from "express";
import { auth } from "../middleware/auth.js";
import { admin } from "../middleware/admin.js";
import { subscribe, list } from "../controllers/newsletterController.js";

const router = express.Router();

router.post("/", subscribe);
router.get("/", auth, admin, list);

export default router;
