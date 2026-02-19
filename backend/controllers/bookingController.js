import Booking from "../models/Booking.js";
import Package from "../models/Package.js";
import { translateDoc } from "../utils/translate.js";

export async function create(req, res, next) {
  try {
    const { packageId, travelers, startDate, endDate } = req.body;
    const booking = await Booking.create({
      userId: req.user._id,
      packageId,
      travelers: travelers || [],
      startDate,
      endDate,
    });
    const populated = await Booking.findById(booking._id)
      .populate("packageId")
      .populate("userId", "name email")
      .lean();
    res.status(201).json({ booking: populated });
  } catch (err) {
    next(err);
  }
}

export async function myBookings(req, res, next) {
  try {
    const bookings = await Booking.find({ userId: req.user._id })
      .populate("packageId")
      .populate("userId", "name email")
      .sort({ createdAt: -1 })
      .lean();
    const lang = req.lang;
    const translated = bookings.map((b) => {
      const pkg = b.packageId;
      if (pkg && typeof pkg.title === "object") {
        b.packageId = { ...pkg, title: pkg.title[lang] || pkg.title.en, description: pkg.description?.[lang] || pkg.description?.en };
      }
      return b;
    });
    res.json({ bookings: translated });
  } catch (err) {
    next(err);
  }
}

export async function list(req, res, next) {
  try {
    const bookings = await Booking.find()
      .populate("packageId")
      .populate("userId", "name email")
      .sort({ createdAt: -1 })
      .lean();
    res.json({ bookings });
  } catch (err) {
    next(err);
  }
}

export async function updateStatus(req, res, next) {
  try {
    const { status, paymentStatus } = req.body;
    const updates = {};
    if (status != null) updates.status = status;
    if (paymentStatus != null) updates.paymentStatus = paymentStatus;
    const booking = await Booking.findByIdAndUpdate(req.params.id, updates, { new: true })
      .populate("packageId")
      .populate("userId", "name email");
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    res.json({ booking });
  } catch (err) {
    next(err);
  }
}
