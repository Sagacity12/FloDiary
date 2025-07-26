import { Request, Response, NextFunction } from "express";
import {
  getUserById,
  getUserByUsername,
  getUserProfile,
  updateUserProfile,
  updateProfilePicture,
  findUserByEmail,
} from "../services/user";
import { constructHttpErrorResponse } from "../helpers/helper";
import createError from "http-errors";

/**
 * Get user by ID
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function
 */
export const getUserByIdController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return next(createError(400, "User ID is required"));
    }

    const result = await getUserById(userId);
    return constructHttpErrorResponse(result, null, 200)(res);
  } catch (error) {
    next(error);
  }
};

/**
 * Get user by username
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function
 */
export const getUserByUsernameController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { username } = req.params;

    if (!username) {
      return next(createError(400, "Username is required"));
    }

    const user = await getUserByUsername(username);

    if (!user) {
      return next(createError(404, "User not found"));
    }

    return constructHttpErrorResponse({ user }, null, 200)(res);
  } catch (error) {
    next(error);
  }
};

/**
 * Get current user profile
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
 * Update user profile
 * @param req - Express request object (requires auth)
 * @param res - Express response object
 * @param next - Express next function
 */
export const updateProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user?.id) {
      return next(createError(401, "Authentication required"));
    }

    const result = await updateUserProfile(req.user.id, req.body);
    return constructHttpErrorResponse(result, null, 200)(res);
  } catch (error) {
    next(error);
  }
};

/**
 * Update user profile picture
 * @param req - Express request object (requires auth)
 * @param res - Express response object
 * @param next - Express next function
 */
export const updateProfilePictureController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user?.id) {
      return next(createError(401, "Authentication required"));
    }

    const { profilePictureUrl } = req.body;

    if (!profilePictureUrl) {
      return next(createError(400, "Profile picture URL is required"));
    }

    const result = await updateProfilePicture(req.user.id, profilePictureUrl);
    return constructHttpErrorResponse(result, null, 200)(res);
  } catch (error) {
    next(error);
  }
};

/**
 * Find user by email (admin function)
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function
 */
export const findUserByEmailController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email } = req.params;

    if (!email) {
      return next(createError(400, "Email is required"));
    }

    const user = await findUserByEmail(email);

    if (!user) {
      return next(createError(404, "User not found"));
    }

    return constructHttpErrorResponse({ user }, null, 200)(res);
  } catch (error) {
    next(error);
  }
};

/**
 * Get user public profile (without sensitive data)
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function
 */
export const getPublicProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { identifier } = req.params;

    if (!identifier) {
      return next(createError(400, "User identifier is required"));
    }

    let user;

    if (identifier.length === 24) {
      user = await getUserById(identifier);
    } else {
      user = await getUserByUsername(identifier);
    }

    if (!user) {
      return next(createError(404, "User not found"));
    }

    const publicProfile = {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
      profilePicture: user.profilePicture,
    };

    return constructHttpErrorResponse({ user: publicProfile }, null, 200)(res);
  } catch (error) {
    next(error);
  }
};

/**
 * Delete user account (placeholder - implement proper service)
 * @param req - Express request object (requires auth)
 * @param res - Express response object
 * @param next - Express next function
 */
export const deleteAccount = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user?.id) {
      return next(createError(401, "Authentication required"));
    }

    //  Implement deleteUser service function
    // For now, return a placeholder message
    const result = {
      message:
        "Account deletion requested. This feature will be implemented soon.",
      userId: req.user.id,
    };

    return constructHttpErrorResponse(result, null, 200)(res);
  } catch (error) {
    next(error);
  }
};

/**
 * Get all users (admin function)
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function
 */
export const getAllUsersController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
   
    const result = {
      message: "Get all users functionality will be implemented soon.",
      users: [],
    };

    return constructHttpErrorResponse(result, null, 200)(res);
  } catch (error) {
    next(error);
  }
};

/**
 * Search users by criteria
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function
 */
export const searchUsersController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { q } = req.query;

    if (!q) {
      return next(createError(400, "Search query is required"));
    }

    
    const result = {
      message: "User search functionality will be implemented soon.",
      query: q,
      results: [],
    };

    return constructHttpErrorResponse(result, null, 200)(res);
  } catch (error) {
    next(error);
  }
};
