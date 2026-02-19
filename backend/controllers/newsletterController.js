import Newsletter from "../models/Newsletter.js";

export async function subscribe(req, res, next) {
  try {
    const { email } = req.body;
    const existing = await Newsletter.findOne({ email });
    if (existing) return res.status(400).json({ message: "Email already subscribed" });
    const sub = await Newsletter.create({ email });
    res.status(201).json({ message: "Subscribed", subscription: sub });
  } catch (err) {
    next(err);
  }
}

export async function list(req, res, next) {
  try {
    const subscriptions = await Newsletter.find().sort({ createdAt: -1 }).lean();
    res.json({ subscriptions });
  } catch (err) {
    next(err);
  }
}
