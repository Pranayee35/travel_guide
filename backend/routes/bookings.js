import express from "express";
import { auth } from "../middleware/auth.js";
import { admin } from "../middleware/admin.js";
import { language } from "../middleware/language.js";
import * as ctrl from "../controllers/bookingController.js";

const router = express.Router();
router.use(language);

router.post("/", auth, ctrl.create);
router.get("/my", auth, ctrl.myBookings);
router.get("/", auth, admin, ctrl.list);
router.patch("/:id", auth, admin, ctrl.updateStatus);

export default router;
