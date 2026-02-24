import mongoose from "mongoose";

const registrationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    password: { type: String, required: true, select: false }, // 'select: false' hides password by default
    instituation: { type: String, required: true, trim: true },
    country: { type: String, required: true, trim: true },
    state: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    // foodper: { type: String, required: true, trim: true },
    phone: { type: String, trim: true },
    altphone: { type: String, trim: true },
    cate: { type: String, required: true, trim: true },
    regFee: { type: String, required: true, trim: true },
    paymentmode: { type: String, required: true, trim: true },
    trnsNo: { type: String, required: true, trim: true },
    paymentScreenshotUrl: { type: String, trim: true },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled"],
      default: "pending",
      trim: true,
    },
    email: { type: String, required: true, trim: true, lowercase: true },
    designation: { type: String, required: true },
    memberId :{ type : String },
    studentId : {type : String},
    refreshToken :{type : String},
      role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
      required: true,
    },
  },
  { timestamps: true }
);

registrationSchema.index({ email: 1 }, { unique: false });

export const Registration = mongoose.model("Registration", registrationSchema);
