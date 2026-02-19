import User from "../models/User.js";
import { SUPPORTED_LANGS } from "../config/constants.js";

export async function getProfile(req, res, next) {
  try {
    res.json({ user: req.user });
  } catch (err) {
    next(err);
  }
}

export async function updateProfile(req, res, next) {
  try {
    const { name, preferredLanguage } = req.body;
    const updates = {};
    if (name != null) updates.name = name;
    if (preferredLanguage != null && SUPPORTED_LANGS.includes(preferredLanguage)) {
      updates.preferredLanguage = preferredLanguage;
    }
    const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true }).select("-password");
    res.json({ user });
  } catch (err) {
    next(err);
  }
}

export async function listUsers(req, res, next) {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 }).lean();
    res.json({ users });
  } catch (err) {
    next(err);
  }
}

export async function updateUserByAdmin(req, res, next) {
  try {
    const { role, preferredLanguage } = req.body;
    const updates = {};
    if (role != null) updates.role = role;
    if (preferredLanguage != null && SUPPORTED_LANGS.includes(preferredLanguage)) {
      updates.preferredLanguage = preferredLanguage;
    }
    const user = await User.findByIdAndUpdate(req.params.id, updates, { new: true }).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ user });
  } catch (err) {
    next(err);
  }
}
