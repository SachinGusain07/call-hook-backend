import { Registration } from "../models/Registration.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { triggerTwilioCall } from "../utils/twillo/twillo.js";

export const callingWebHook = asyncHandler(async (req, res) => {
  const alertData = req.body;

  console.log(req.body , "this is the req")
  const user = req.webhookUser;

  console.log(alertData , "data")


  res.status(200).json({
    status: true,
    message: "Signal received. Processing call in background.",
  });

  (async () => {
    console.log(`🚀 Processing Signal for ${user?.name} (${alertData?.symbol})`);

    const result = await triggerTwilioCall(user?.phone, alertData);

    if (result.success) {
      // 5. Update Call Database Counters
      await Registration.findByIdAndUpdate(user?.id, {
        $inc: { totalCallMade: 1, totalCallMadeMonthly: 1 }
      });
      console.log(`✅ Database Updated for ${user?.name}`);
    }
  })();
});