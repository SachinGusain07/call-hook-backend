
import { sendMail } from "../../utils/nodemailer/sendEmail.js"
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid"; // Import UUID generator
import { Registration } from "../../models/Registration.js";

export const generateWebhookData = (name) => {
  const cleanName = name.toLowerCase().replace(/[^a-z0-9]/g, "-"); 
  const uniqueId = `${cleanName}-${uuidv4()}`;
  const url = `http://147.93.19.161/api/v1/webhook/${uniqueId}`;
  
  return { uniqueId, url };
};

function validateRegistrationInput(name, email, phone, password) {
  const missing = [];
  if (!name) missing.push("name");
  if (!email) missing.push("email");
  if (!phone) missing.push("phone");
  if (!password) missing.push("password");

  if (missing.length) {
    const error = new Error(`Missing fields: ${missing.join(", ")}`);
    error.statusCode = 400;
    throw error;
  }
}


async function checkUserExistence(email, phone) {
  const existing = await Registration.findOne({
    $or: [{ email: email.toLowerCase() }, { phone }],
  });
  if (existing) {
    const error = new Error("User with this email or phone already exists");
    error.statusCode = 403;
    throw error;
  }
}


function handleControllerError(err, res) {
  console.error("Registration Error:", err.message);
  const status = err.statusCode || (err.code === 11000 ? 409 : 500);
  res.status(status).json({
    success: false,
    error: err.message || "Internal Server Error",
  });
}
const expiryDate = new Date();
expiryDate.setDate(expiryDate.getDate() + 15);

export async function createRegistration(req, res) {
  try {
    const { name, email, password, phone } = req.body || {};

    validateRegistrationInput(name, email, phone, password);

    await checkUserExistence(email, phone);

    // 3. Generate Webhook & Hash Password
    const { uniqueId, url } = generateWebhookData(name);
    console.log(url , "webhook");
    const passwordHash = await bcrypt.hash(String(password), 10);

    // 4. Save to Database
    const newUser = await Registration.create({
      name,
      email: email.toLowerCase(),
      phone,
      password: passwordHash,
      webhookId: uniqueId,
        subscriptionValidUntil: expiryDate, // This is the calculated date

      isSubscriptionActive: false,
      isCallMade: false,
    });

    sendMail(newUser.email, newUser.name, url).catch(console.error);

    return res.status(201).json({
      success: true,
      message: "Registered successfully",
      data: {
        userId: newUser._id,
        webhookUrl: url,
      },
    });

  } catch (err) {
    handleControllerError(err, res);
  }
}



export async function listRegistrations(_req, res) {
  try {
    const docs = await Registration.find().sort({ createdAt: -1 }).lean()
    res.json(docs)
  } catch (err) {
    res.status(500).json({ error: err?.message || 'Server error' })
  }
}