import State from "../models/State.js";
import { translateDoc, translateList } from "../utils/translate.js";

const MULTILINGUAL_FIELDS = ["name"];

export async function list(req, res, next) {
  try {
    const lang = req.lang;
    const raw = req.query.raw === "1" || req.user?.role === "admin";
    const { regionId } = req.query;
    const filter = regionId ? { regionId } : {};
    const states = await State.find(filter).populate("regionId").sort({ createdAt: -1 }).lean();
    const translated = raw ? states : translateList(states, MULTILINGUAL_FIELDS, lang);
    res.json({ states: translated });
  } catch (err) {
    next(err);
  }
}

export async function getOne(req, res, next) {
  try {
    const state = await State.findById(req.params.id).populate("regionId").lean();
    if (!state) return res.status(404).json({ message: "State not found" });
    const raw = req.query.raw === "1" || req.user?.role === "admin";
    const translated = raw ? state : translateDoc(state, MULTILINGUAL_FIELDS, req.lang);
    res.json({ state: translated });
  } catch (err) {
    next(err);
  }
}

export async function create(req, res, next) {
  try {
    const state = await State.create(req.body);
    res.status(201).json({ state });
  } catch (err) {
    next(err);
  }
}

export async function update(req, res, next) {
  try {
    const state = await State.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!state) return res.status(404).json({ message: "State not found" });
    res.json({ state });
  } catch (err) {
    next(err);
  }
}

export async function remove(req, res, next) {
  try {
    const state = await State.findByIdAndDelete(req.params.id);
    if (!state) return res.status(404).json({ message: "State not found" });
    res.json({ message: "Deleted" });
  } catch (err) {
    next(err);
  }
}
