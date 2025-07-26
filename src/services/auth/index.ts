import {
  validateUserLoginData,
  validateUserData,
  validatePasswordChangeData,
} from "../user/validate";
import {
  IUserDocument,
  UserLogin,
  IUserRegistration,
  IPasswordChange,
} from "src/common/interfaces/user";
import createError from "http-errors";
import * as helpers from "src/helpers/helper";
import User from "src/models/userSchema";
import { checkUserExists } from "../user";
import { blacklistToken } from "src/helpers/blacklisted";

/**
 * Register a new user
 * @param userData - User registration data
 * @returns Promise with created user document
 */
export const registerUser = async (
  data: IUserRegistration
): Promise<{
  user: IUserDocument;
  token: string;
  message: string;
}> => {
  try {
    await validateUserData(data);

    const userExists = await checkUserExists(data.email);
    if (userExists) {
      throw createError(409, "User already exists with this email");
    }

    const hashedPassword = await helpers.hashedPassword(data.password);

    const newUser = new User({
      firstName: data.firstName,
      lastName: data.lastName,
      username: data.username.toLowerCase(),
      email: data.email.toLowerCase(),
      password: hashedPassword,
      isEmailVerified: true,
    });

    const savedUser = await newUser.save();

    const authToken = await helpers.jwtSign({ id: savedUser._id });

    return {
      user: savedUser,
      token: authToken,
      message: "Registration successful! You are now logged in.",
    };
  } catch (error) {
    if (error && typeof error === "object" && "status" in error) throw error;
    throw createError(
      500,
      `Failed to register user: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
};

/**
 * User login
 * @param loginData - User login data
 * @returns Promise with user document and JWT token
 */
export const loginUser = async (
  loginData: UserLogin
): Promise<{
  user: IUserDocument;
  token: string;
}> => {
  try {
    await validateUserLoginData(loginData);

    const user = await User.findOne({
      username: loginData.username.toLowerCase(),
      isActive: true,
    }).select("+password");

    if (!user) {
      throw createError(401, "Invalid username or password");
    }

    const isPasswordValid = await helpers.comparePassword(
      loginData.password,
      user.password
    );

    if (!isPasswordValid) {
      throw createError(401, "Invalid username or password");
    }

    
    await User.findByIdAndUpdate(user._id, {
      lastLoginAt: new Date(),
    });

    return {
      user,
      token: await helpers.jwtSign({ id: user._id }),
    };
  } catch (error: any) {
    if (error && typeof error === "object" && "status" in error) throw error;
    throw createError(
      500,
      `Login failed: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
};

/**
 * Change user password
 * @param userId - User ID
 * @param passwordData - Current and new password data
 * @returns Promise with success message
 */
export const changePassword = async (
  userId: string,
  passwordData: IPasswordChange
): Promise<{
  message: string;
}> => {
  try {
    await validatePasswordChangeData(passwordData);

    const user = await User.findById(userId).select("+password");
    if (!user) {
      throw createError(404, "User not found");
    }

    const isCurrentPasswordValid = await helpers.comparePassword(
      passwordData.currentPassword,
      user.password
    );

    if (!isCurrentPasswordValid) {
      throw createError(401, "Current password is incorrect");
    }

    // Check if new password is different from current
    const isSamePassword = await helpers.comparePassword(
      passwordData.newPassword,
      user.password
    );

    if (isSamePassword) {
      throw createError(
        400,
        "New password must be different from current password"
      );
    }

    const passwordStrength = helpers.isStrongPassword(passwordData.newPassword);
    if (!passwordStrength.isValid) {
      throw createError(400, passwordStrength.message);
    }

    const hashedNewPassword = await helpers.hashedPassword(
      passwordData.newPassword
    );

    await User.findByIdAndUpdate(userId, {
      password: hashedNewPassword,
      lastPasswordChange: new Date(),
    });

    return {
      message: "Password changed successfully",
    };
  } catch (error: any) {
    if (error && typeof error === "object" && "status" in error) throw error;
    throw createError(
      500,
      `Password change failed: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
};

/**
 * Reset password (for admin or when user is logged in)
 * @param userId - User ID
 * @param newPassword - New password
 * @returns Promise with success message
 */
export const resetPassword = async (
  userId: string,
  newPassword: string
): Promise<{
  message: string;
}> => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw createError(404, "User not found");
    }

    // Validate password strength
    const passwordStrength = helpers.isStrongPassword(newPassword);
    if (!passwordStrength.isValid) {
      throw createError(400, passwordStrength.message);
    }

    // Hash new password
    const hashedNewPassword = await helpers.hashedPassword(newPassword);

    // Update password and set lastPasswordChange
    await User.findByIdAndUpdate(userId, {
      password: hashedNewPassword,
      lastPasswordChange: new Date(),
      passwordResetRequested: false,
    });

    return {
      message: "Password reset successfully",
    };
  } catch (error: any) {
    if (error && typeof error === "object" && "status" in error) throw error;
    throw createError(
      500,
      `Password reset failed: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
};

/**
 * Logout user by blacklisting their JWT token
 * @param token - JWT token to blacklist
 * @param userId - User ID (optional, for logging)
 * @returns Promise with success message
 */
export const logoutUser = async (
  token: string,
  userId?: string
): Promise<{
  message: string;
}> => {
  try {

    const decoded = await helpers.jwtVerify(token);
    if (!decoded || !decoded.id) {
      throw createError(401, "Invalid token");
    }

    
    await blacklistToken(token);

   
    if (userId) {
      await User.findByIdAndUpdate(userId, {
        lastLoginAt: new Date(),
      });
    }

    return {
      message: "Logged out successfully",
    };
  } catch (error: any) {
    if (error && typeof error === "object" && "status" in error) throw error;
    throw createError(
      500,
      `Logout failed: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
};

/**
 * Logout from all devices (invalidate all tokens for a user)
 * @param userId - User ID
 * @returns Promise with success message
 */
export const logoutAllDevices = async (
  userId: string
): Promise<{
  message: string;
}> => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw createError(404, "User not found");
    }

    // Update lastPasswordChange to invalidate all existing tokens
    // This works because JWT tokens contain the user ID and are verified against user data

    await User.findByIdAndUpdate(userId, {
      lastPasswordChange: new Date(),
    });

    return {
      message: "Logged out from all devices successfully",
    };
  } catch (error: any) {
    if (error && typeof error === "object" && "status" in error) throw error;
    throw createError(
      500,
      `Logout from all devices failed: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
};
