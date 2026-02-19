import Region from "../models/Region.js";
import { translateDoc, translateList } from "../utils/translate.js";

const MULTILINGUAL_FIELDS = ["name"];

export async function list(req, res, next) {
  try {
    const lang = req.lang;
    const raw = req.query.raw === "1" || req.user?.role === "admin";
    const regions = await Region.find().sort({ createdAt: -1 }).lean();
    const translated = raw ? regions : translateList(regions, MULTILINGUAL_FIELDS, lang);
    res.json({ regions: translated });
  } catch (err) {
    next(err);
  }
}

export async function getOne(req, res, next) {
  try {
    const region = await Region.findById(req.params.id).lean();
    if (!region) return res.status(404).json({ message: "Region not found" });
    const raw = req.query.raw === "1" || req.user?.role === "admin";
    const translated = raw ? region : translateDoc(region, MULTILINGUAL_FIELDS, req.lang);
    res.json({ region: translated });
  } catch (err) {
    next(err);
  }
}

export async function create(req, res, next) {
  try {
    const region = await Region.create(req.body);
    res.status(201).json({ region });
  } catch (err) {
    next(err);
  }
}

export async function update(req, res, next) {
  try {
    const region = await Region.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!region) return res.status(404).json({ message: "Region not found" });
    res.json({ region });
  } catch (err) {
    next(err);
  }
}

export async function remove(req, res, next) {
  try {
    const region = await Region.findByIdAndDelete(req.params.id);
    if (!region) return res.status(404).json({ message: "Region not found" });
    res.json({ message: "Deleted" });
  } catch (err) {
    next(err);
  }
}
