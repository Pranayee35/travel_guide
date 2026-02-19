import Package from "../models/Package.js";
import { translateDoc, translateList } from "../utils/translate.js";

const MULTILINGUAL_FIELDS = ["title", "description", "itinerary"];

function translateItinerary(itinerary, lang) {
  if (!Array.isArray(itinerary)) return [];
  return itinerary.map((item) => {
    if (typeof item === "object" && item !== null) {
      const translated = {};
      for (const [k, v] of Object.entries(item)) {
        if (typeof v === "object" && v !== null && !Array.isArray(v)) {
          translated[k] = v[lang] || v.en || Object.values(v)[0] || "";
        } else {
          translated[k] = v;
        }
      }
      return translated;
    }
    return item;
  });
}

export async function list(req, res, next) {
  try {
    const lang = req.lang;
    const raw = req.query.raw === "1" || req.user?.role === "admin";
    const { destinationId } = req.query;
    const filter = destinationId ? { destinationId } : {};
    const packages = await Package.find(filter).populate("destinationId").sort({ createdAt: -1 }).lean();
    const translated = raw
      ? packages
      : packages.map((p) => {
          const t = translateDoc(p, ["title", "description"], lang);
          t.itinerary = translateItinerary(p.itinerary, lang);
          return t;
        });
    res.json({ packages: translated });
  } catch (err) {
    next(err);
  }
}

export async function getOne(req, res, next) {
  try {
    const pkg = await Package.findById(req.params.id).populate("destinationId").lean();
    if (!pkg) return res.status(404).json({ message: "Package not found" });
    const raw = req.query.raw === "1" || req.user?.role === "admin";
    if (raw) return res.json({ package: pkg });
    const translated = translateDoc(pkg, ["title", "description"], req.lang);
    translated.itinerary = translateItinerary(pkg.itinerary, req.lang);
    res.json({ package: translated });
  } catch (err) {
    next(err);
  }
}

export async function create(req, res, next) {
  try {
    const pkg = await Package.create(req.body);
    res.status(201).json({ package: pkg });
  } catch (err) {
    next(err);
  }
}

export async function update(req, res, next) {
  try {
    const pkg = await Package.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!pkg) return res.status(404).json({ message: "Package not found" });
    res.json({ package: pkg });
  } catch (err) {
    next(err);
  }
}

export async function remove(req, res, next) {
  try {
    const pkg = await Package.findByIdAndDelete(req.params.id);
    if (!pkg) return res.status(404).json({ message: "Package not found" });
    res.json({ message: "Deleted" });
  } catch (err) {
    next(err);
  }
}
