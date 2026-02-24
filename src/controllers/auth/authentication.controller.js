import { Registration } from "../../models/Registration.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import ErrorHandler from "../../utils/ErrorHandler.js";
import { generateAccessAndRefreshTokens } from "../../utils/jwtToken.js";
import bcrypt from  "bcryptjs" 

const setAuthCookies = (res, accessToken, refreshToken) => {
  // console.log(  accessToken, refreshToken, "reached")
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite:  process.env.NODE_ENV === "production" ?  "None" : "Lax",
    path: "/",
  };
 res.cookie("accessToken", accessToken, {
    ...cookieOptions,
    maxAge: 24 * 60 * 60 * 1000,
  });
  res.cookie("refreshToken", refreshToken, {
    ...cookieOptions,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};


export const loginUser = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

    if (!email || !password) {
    return next(new ErrorHandler("Please provide email and password", 400));
  }

  const user = await Registration.findOne({ email }).select("+password");
  if (!user) return next(new ErrorHandler("Invalid credentials", 404));

  // COMPARISON OUTSIDE: Done here
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return next(new ErrorHandler("Invalid credentials", 404));

  // Generate new tokens
  const { accessToken, refreshToken } = generateAccessAndRefreshTokens(user._id);

  // SESSION MANAGEMENT: Save refresh token to DB. 
  // If user logs in elsewhere, this token is replaced, kicking out the old session.
  user.refreshToken = refreshToken;
  await user.save();

  setAuthCookies(res, accessToken, refreshToken);


  res.status(200).json({
    success: true,
    accessToken,
    refreshToken,
    user: { id: user._id, name: user.name, email: user.email , role : user.role  , token : user.refreshToken }
  });
});



export const refreshAccessToken = asyncHandler(async (req, res, next) => {
  const  token = (req.headers.authorization?.startsWith("Bearer") 
      ? req.headers.authorization.split(" ")[1] 
      : null) || req.cookies?.refreshToken;


  if (!token) return next(new ErrorHandler("Refresh token required", 401));

  const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
  const user = await Registration.findById(decoded.id);

  if (!user || user.refreshToken !== token) {
    return next(new ErrorHandler("Session expired or logged in elsewhere", 403));
  }

  const tokens = generateAccessAndRefreshTokens(user._id);
  user.refreshToken = tokens.refreshToken;
  await user.save();

  setAuthCookies(res, tokens.accessToken, tokens.refreshToken);

  res.status(200).json({
    success: true,
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken
  });
});
