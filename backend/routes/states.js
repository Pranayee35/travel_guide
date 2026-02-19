import express from "express";
import { auth, optionalAuth } from "../middleware/auth.js";
import { admin } from "../middleware/admin.js";
import { language } from "../middleware/language.js";
import * as ctrl from "../controllers/stateController.js";

const router = express.Router();
router.use(language);

router.get("/", optionalAuth, ctrl.list);
router.get("/:id", optionalAuth, ctrl.getOne);
router.post("/", auth, admin, ctrl.create);
router.put("/:id", auth, admin, ctrl.update);
router.delete("/:id", auth, admin, ctrl.remove);

export default router;
