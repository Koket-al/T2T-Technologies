import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  // 1. Check both Header (Bearer) and Cookies for maximum compatibility
  const authHeader = req.headers.authorization;
  const tokenFromCookie = req.cookies?.token;

  let token = null;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  } else if (tokenFromCookie) {
    token = tokenFromCookie;
  }

  // 2. If no token is found at all
  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized - Access Denied (No token provided)",
    });
  }

  try {
    // 3. Attempt to verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized - Token verification failed",
      });
    }

    // 4. Attach userId to the request for the controllers to use
    req.userId = decoded.userId;
    next();

  } catch (error) {
    console.error("verifyToken error:", error.name);

    // ✅ NEW: Specific handling for Expired Tokens
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Session expired. Please login again to refresh your secure connection.",
        isExpired: true, // Frontend can use this to auto-redirect to login
      });
    }

    // Handle other types of JWT errors (malformed, wrong secret, etc)
    return res.status(401).json({
      success: false,
      message: "Unauthorized - Invalid or tampered token",
    });
  }
};