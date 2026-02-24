import jwt from "jsonwebtoken";
import { generateAccessAndRefreshTokens } from "../utils/jwtToken.js";
import { Registration } from "../models/Registration.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import ErrorHandler from "../utils/ErrorHandler.js";

// Helper to set cookies separately (keeping logic clean)
const setAuthCookies = (res, accessToken) => {
  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ?  "None" : "Lax",
    path: "/",
  };
  res.cookie("accessToken", accessToken, { ...options, maxAge: 24 * 60 * 60 * 1000 });
  // res.cookie("refreshToken", refreshToken, { ...options, maxAge: 7 * 24 * 60 * 60 * 1000 });
};

export const isAuthenticated = asyncHandler(async (req, res, next) => {
  const accessToken = req.cookies?.accessToken;

  const refreshToken = req.cookies?.refreshToken || 
    (req.headers["x-refresh-token"]);

  // 2. If absolutely no access token, check if we can refresh immediately
  if (!accessToken) {
    if (refreshToken) return await handleAutoRefresh(refreshToken, req, res, next);
    // console.log("4")
    return next(new ErrorHandler("Please login to access this resource", 401));
  }

  try {
    // 3. Try verifying Access Token
    const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
    req.user = await Registration.findById(decoded.id);
    return next();
  } catch (error) {
    // console.log(error)
    // 4. If Access Token is expired, try Auto-Refresh using Refresh Token
    if (error.name === "TokenExpiredError" && refreshToken) {
      // console.log("generating new token due to expiration")
      return await handleAutoRefresh(refreshToken, req, res, next);
    }
    
    // console.log("3")
    return next(new ErrorHandler("Session invalid. Please login again.", 401));
  }
});

// Internal function to handle the refresh logic within the middleware
async function handleAutoRefresh(refreshToken, req, res, next) {
  try {
    // Verify the Refresh Token
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    // console.log(decoded , "decodede")
    const user = await Registration.findById(decoded.id);
    // console.log(user , "user hun");

    // console.log( "---------------" ,refreshToken , "-------------")

    // Security: Check if user exists and token matches database
    if (!user || user.refreshToken !== refreshToken) {
      console.log("2");
        console.log("❌ TOKEN MISMATCH");
      return next(new ErrorHandler("Session expired. Please login again.", 401));
    }

    // Generate new pair
    const tokens = generateAccessAndRefreshTokens(user._id);

    setAuthCookies(res, tokens.accessToken);

    
    refreshToken = tokens.accessToken;
   
    req.user = user;
    next();
  } catch (err) {
    return next(new ErrorHandler("Session expired. Please login again.", 401));
  }
}





export const isAllowedRoles = (...allowedRoles) => {
  return (req, res, next) => {
    // console.log(req.user , "user detais")
    // 1. Check if user exists (set by your previous auth/login middleware)
    if (!req.user) {
      
      return res.status(401).json({ message: "Please login to access this resource" });
    }

    // 2. Check if the user's role is in the allowed list
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Role: ${req.user.role} is not authorized to access this resource`
      });
    }

    next();
  };
};

// router.route("/admin/user/:id").delete(
//   isAuthenticatedUser, 
//   isAllowedRoles("admin" , "user"), 
//   deleteUser
// );
