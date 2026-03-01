import { Registration } from "../models/Registration.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendSubscriptionAlertMail } from "../utils/nodemailer/sendEmail.js";

export const checkWebhookSubscription = asyncHandler(async (req, res, next) => {
  const { webhookId } = req.params;

  if (!webhookId) {
    return next(new ErrorHandler("Webhook ID is required", 400));
  }

  // 1. Find the user by webhookId
  // We don't use .select("+password") here because we only need logic fields
  const user = await Registration.findOne({ webhookId });

  if (!user) {
    return next(new ErrorHandler("Invalid Webhook ID", 404));
  }

  const now = new Date();
  let failureReason = "";

  // 2. Logic Check: Is subscription manually disabled?
  if (!user.isSubscriptionActive) {
    failureReason = "Your subscription is currently inactive.";
  } 
  
  // 3. Logic Check: Has the date expired?
  else if (user.subscriptionValidUntil && user.subscriptionValidUntil < now) {
    failureReason = "Your subscription period has expired.";
  } 
  
  // 4. Logic Check: Has the monthly call quota been exhausted?
  else if (user.totalCallMadeMonthly >= user.allowedCallMonthly) {
    failureReason = "Monthly call limit reached.";
  }

  // 5. If any check fails
  if (failureReason) {
    // Send mail in background (don't await so the response is fast)
    sendSubscriptionAlertMail(user.email, user.name, failureReason);

    // Stop the request here
    return res.status(403).json({
      success: false,
      message: `${failureReason} Access denied.`,
    });
  }

  // 6. Everything is okay: Attach user info to the request for the controller
  req.webhookUser = {
    id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    totalCallMade: user.totalCallMade,
    totalCallMadeMonthly: user.totalCallMadeMonthly
  };

  next();
});