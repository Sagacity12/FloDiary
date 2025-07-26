import { Request, Response, NextFunction } from "express";
import {
  registerUser,
  loginUser,
  resetPassword,
  logoutUser,
  logoutAllDevices,
} from "../services/auth";
import { getUserProfile } from "../services/user";
import { constructHttpErrorResponse } from "../helpers/helper";
import createError from "http-errors";

/**
 * Register a new user
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function
 */
export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await registerUser(req.body);
    return constructHttpErrorResponse(result, null, 201)(res);
  } catch (error) {
    next(error);
  }
};

/**
 * Login user
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function
 */
export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await loginUser(req.body);
    return constructHttpErrorResponse(result, null, 200)(res);
  } catch (error) {
    next(error);
  }
};

/**
 * Change user password
 * @param req - Express request object (requires auth)
 * @param res - Express response object
 * @param next - Express next function
 */
export const getProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user?.id) {
      return next(createError(401, "Authentication required"));
    }

    const result = await getUserProfile(req.user.id);
    return constructHttpErrorResponse(result, null, 200)(res);
  } catch (error) {
    next(error);
  }
};

/**
 * Reset user password (admin function)
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function
 */
export const resetUserPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req.params;
    const { newPassword } = req.body;

    if (!userId || !newPassword) {
      return next(createError(400, "User ID and new password are required"));
    }

    const result = await resetPassword(userId, newPassword);
    return constructHttpErrorResponse(result, null, 200)(res);
  } catch (error) {
    next(error);
  }
};

/**
 * Logout user from current device
 * @param req - Express request object (requires auth)
 * @param res - Express response object
 * @param next - Express next function
 */
export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.token) {
      return next(createError(401, "Authentication token required"));
    }

    const result = await logoutUser(req.token, req.user?.id);
    return constructHttpErrorResponse(result, null, 200)(res);
  } catch (error) {
    next(error);
  }
};

/**
 * Logout user from all devices
 * @param req - Express request object (requires auth)
 * @param res - Express response object
 * @param next - Express next function
 */
export const logoutAll = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user?.id) {
      return next(createError(401, "Authentication required"));
    }

    const result = await logoutAllDevices(req.user.id);
    return constructHttpErrorResponse(result, null, 200)(res);
  } catch (error) {
    next(error);
  }
};

/**
 * Verify token validity (health check for frontend)
 * @param req - Express request object (requires auth)
 * @param res - Express response object
 * @param next - Express next function
 */
export const verifyToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user?.id) {
      return next(createError(401, "Invalid token"));
    }

    const result = {
      userId: req.user.id,
      isValid: true,
      message: "Token is valid",
    };

    return constructHttpErrorResponse(result, null, 200)(res);
  } catch (error) {
    next(error);
  }
};
