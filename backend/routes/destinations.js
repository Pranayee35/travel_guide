import express from "express";
import { auth, optionalAuth } from "../middleware/auth.js";
import { admin } from "../middleware/admin.js";
import { language } from "../middleware/language.js";
import { upload } from "../middleware/upload.js";
import * as ctrl from "../controllers/destinationController.js";

const router = express.Router();
router.use(language);

router.get("/", optionalAuth, ctrl.list);
router.get("/region/:regionId", ctrl.listByRegion);
router.get("/:id", optionalAuth, ctrl.getOne);
router.post("/", auth, admin, ctrl.create);
router.post("/:id/images", auth, admin, upload.array("images", 10), (req, res, next) => {
  if (!req.files?.length) return next(new Error("No files"));
  req.body = { images: req.files.map((f) => `/uploads/${f.filename}`) };
  ctrl.addImages(req, res, next);
});
router.put("/:id", auth, admin, ctrl.update);
router.delete("/:id", auth, admin, ctrl.remove);

export default router;
