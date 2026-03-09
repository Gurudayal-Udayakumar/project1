import Subscriber from "../models/Subscriber.js";
import { sendEmail } from "../utils/sendEmail.js";
import { validateEmail } from "../middleware/validationMiddleware.js";

/* 📩 USER SUBSCRIBE */
export const subscribeEmail = async (req, res) => {
  const { email } = req.body;

  try {
    if (!validateEmail(email)) {
      return res.status(400).json({ success: false, message: "Invalid email format" });
    }

    const exists = await Subscriber.findOne({ email: email.toLowerCase() });
    if (exists)
      return res.status(400).json({ message: "Already subscribed" });

    await Subscriber.create({ email: email.toLowerCase() });

    // Thank you email
    await sendEmail(
      email,
      "Thanks for Subscribing!",
      `
      <h2>Thanks for subscribing 🎉</h2>
      <p>Stay connected to get latest offers and updates.</p>
      `
    );

    res.json({ success: true, message: "Subscribed successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Subscription failed" });
  }
};

/* 📢 ADMIN SEND OFFER */
export const sendOfferToSubscribers = async (req, res) => {
  try {
    const { title, description } = req.body;

    const subscribers = await Subscriber.find();

    for (const sub of subscribers) {
      await sendEmail(
        sub.email,
        title,
        `
        <h2>${title}</h2>
        <p>${description}</p>
        <p>Happy Shopping 🛍️</p>
        `
      );
    }

    res.json({ success: true, message: "Offer sent to all subscribers" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to send offer" });
  }
};
