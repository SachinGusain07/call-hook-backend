// import twilio from "twilio";

// const client = twilio(
//   process.env.TWILIO_ACCOUNT_SID,
//   process.env.TWILIO_AUTH_TOKEN
// );

// export const createCall = async ({
//   symbol,
//   price,
//   exchange,
//   time,
//   action
// }) => {
//   try {
//     // Format price with commas
//     const formattedPrice = Number(price).toLocaleString("en-IN");

//     // Convert action to proper word
//     const actionText =
//       action.toLowerCase() === "buy"
//         ? "Buy signal triggered"
//         : action.toLowerCase() === "sell"
//         ? "Sell signal triggered"
//         : "Price alert triggered";

//     // Build dynamic message
//     const message = `
//       Trading Alert.
//       ${symbol} at ${formattedPrice}.
//       ${actionText} on ${exchange}.
//     `;

//     const call = await client.calls.create({
//       from: "+18304687592",
//       to: "+91 9368903232",
//       twiml: `<Response><Say voice="alice">${message}</Say></Response>`
//     });

//     console.log("Call SID:", call.sid);
//   } catch (error) {
//     console.error("Call Error:", error.message);
//   }
// };


// // createCall({
// //   symbol: "NIFTY",
// //   price: "25000",
// //   exchange: "NSE",
// //   time: "2026-02-26T11:45:00Z",
// //   action: "buy"
// // });


import twilio from "twilio";

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

export const triggerTwilioCall = async (toPhone, alertData) => {
  const { symbol, price, exchange, action } = alertData;

  try {
    const formattedPrice = Number(price).toLocaleString("en-IN");
    const actionText = action?.toLowerCase() === "buy" ? "Buy signal" : 
                       action?.toLowerCase() === "sell" ? "Sell signal" : "Price alert";

    // The core message
    const message = `Attention. ${symbol} at ${formattedPrice}. ${actionText} triggered on ${exchange}.`;

    // Constructing TwiML to say the message 3 times
    const twiml = `
      <Response>
        <Pause length="2"/>
        <Say voice="alice">${message}</Say>
        <Pause length="1"/>
        <Say voice="alice">I repeat. ${message}</Say>
        <Pause length="1"/>
        <Say voice="alice">One final time. ${message}</Say>
        <Pause length="1"/>
        <Say voice="alice">Goodbye.</Say>
      </Response>
    `;

    const call = await client.calls.create({
      from: process.env.TWILIO_PHONE_NUMBER || "+18304687592",
      to: toPhone,
      twiml: twiml
    });

    console.log(`📞 Call Initiated | SID: ${call.sid} | User: ${toPhone}`);
    return { success: true, sid: call.sid };
  } catch (error) {
    console.error("❌ Twilio Call Error:", error.message);
    return { success: false, error: error.message };
  }
};