import { Types, FilterQuery, QueryOptions } from "mongoose";
import User from "src/models/userSchema";
import { IUserDocument, UserProfileUpdate } from "src/common/interfaces/user";
import { validateUserProfileUpdateData } from "./validate";
import createError from "http-errors";

/**
 * Get user by ID
 * @param userId - User ID
 * @returns Promise with user data
 */
export const getUserById = async (userId: string): Promise<IUserDocument> => {
  try {
    if (!Types.ObjectId.isValid(userId)) {
      throw createError(400, "Invalid user ID format");
    }
    const user = await User.findById(userId);
    if (!user) {
      throw createError(404, "User not found");
    }
    return user;
  } catch (error: any) {
    if (error.status) throw error;
    throw createError(500, `Failed to get user: ${error.message}`);
  }
};

/**
 * Get user by username 
 * @param username - User username
 * @returns Promise with user data or null if not found
 */
export const getUserByUsername = async (
  username: string
): Promise<IUserDocument | null> => {
  try {
    return await User.findOne({ username: username.toLowerCase() });
  } catch (error: any) {
    throw createError(500, `Failed to get user by username: ${error.message}`);
  }
};


/**
 * Check if user already exists by email
 * @param email - User email
 * @param phone - User phone (optional)
 * @returns Promise<boolean>
 */
export const checkUserExists = async (
  email: string,
  phone?: string
): Promise<boolean> => {
  try {
    const query = phone
      ? { $or: [{ email: email.toLowerCase() }, { phone }] }
      : { email: email.toLowerCase() };

    const existingUser = await User.findOne(query);
    return !!existingUser;
  } catch (error: any) {
    throw createError(500, `Failed to check user existence: ${error.message}`);
  }
};

/**
 * Find user by email
 * @param email - User email
 * @returns Promise with user or null
 */
export const findUserByEmail = async (
  email: string
): Promise<IUserDocument | null> => {
  try {
    return await User.findOne({
      email: email.toLowerCase(),
      isActive: true,
    });
  } catch (error: any) {
    throw createError(500, `Failed to find user: ${error.message}`);
  }
};

/**
 * Get user profile by ID (without sensitive fields)
 * @param userId - User ID
 * @returns Promise with user profile data
 */
export const getUserProfile = async (
  userId: string
): Promise<{
  user: IUserDocument;
  message: string;
}> => {
  try {
    const user = await User.findById(userId).select(
      "-password -tempOTP -tempOTPExpiry"
    );
    if (!user) {
      throw createError(404, "User profile not found");
    }

    return {
      user,
      message: "Profile retrieved successfully",
    };
  } catch (error: any) {
    if (error.status) throw error;
    throw createError(500, `Failed to get user profile: ${error.message}`);
  }
};

/**
 * Update User profile
 * @param update userprofile - User profile
 * @returns - User profile updated
 */
export const updateUserProfile = async (
  userId: string,
  updateData: UserProfileUpdate
): Promise<{
  user: IUserDocument;
  message: string;
}> => {
  try {
    await validateUserProfileUpdateData(updateData);

    const currentUser = await User.findById(userId).select("+password").exec();
    if (!currentUser) {
      throw createError(404, "User not found");
    }

    if (updateData.email && updateData.email !== currentUser.email) {
      const emailExists = await checkUserExists(updateData.email);
      if (emailExists) {
        throw createError(409, "Email already exists");
      }
    }

    const updateObject = { ...updateData };

    const updatedUser = await User.findByIdAndUpdate(userId, updateObject, {
      new: true,
      runValidators: true,
    }).select("-password -tempOTP -tempOTPExpiry");

    if (!updatedUser) {
      throw createError(500, "Failed to update profile");
    }

    return {
      user: updatedUser,
      message: "Profile updated successfully",
    };
  } catch (error: unknown) {
    if (error instanceof Error && "status" in error) throw error;
    const message = error instanceof Error ? error.message : "Unknown error";
    throw createError(500, `Failed to update profile: ${message}`);
  }
};

/**
 * Update user profile picture
 * @param userId - User ID
 * @param profilePictureUrl - Profile picture URL
 * @returns Promise with updated user
 */
export const updateProfilePicture = async (
  userId: string,
  profilePictureUrl: string
): Promise<{
  user: IUserDocument;
  message: string;
}> => {
  try {
    const urlRegex = /^https?:\/\/.+/;
    if (!urlRegex.test(profilePictureUrl)) {
      throw createError(400, "Invalid profile picture URL format");
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilePicture: profilePictureUrl },
      { new: true }
    ).select("-password -tempOTP -tempOTPExpiry");

    if (!updatedUser) {
      throw createError(404, "User not found");
    }

    return {
      user: updatedUser,
      message: "Profile picture updated successfully",
    };
  } catch (error: any) {
    if (error.status) throw error;
    throw createError(
      500,
      `Failed to update profile picture: ${error.message}`
    );
  }
};
