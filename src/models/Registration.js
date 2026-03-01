import mongoose from "mongoose";

const registrationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String, required: true, unique: true, trim: true }, // Added phone
    password: { type: String, required: true, select: false },
    role: { type: String, enum: ["admin", "user"], default: "user" },
    
    // Logic fields
    webhookId: { type: String, trim: true },
    isSubscriptionActive: { type: Boolean, default: false },
        subscriptionValidUntil: { 
      type: Date,
      default: null 
    },

    totalCallMade: { 
      type: Number, 
      default: 0 
    },
    allowedCallMonthly: { 
      type: Number, 
      default: 2 
    },
    totalCallMadeMonthly: { 
      type: Number, 
      default: 0 
    },
  },
  { timestamps: true }
);

export const Registration = mongoose.model("Registration", registrationSchema);