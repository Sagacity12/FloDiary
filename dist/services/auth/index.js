"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logoutAllDevices = exports.logoutUser = exports.resetPassword = exports.changePassword = exports.loginUser = exports.registerUser = void 0;
const validate_1 = require("../user/validate");
const http_errors_1 = __importDefault(require("http-errors"));
const helpers = __importStar(require("../../helpers/helper"));
const userSchema_1 = __importDefault(require("../../models/userSchema"));
const user_1 = require("../user");
const blacklisted_1 = require("../../helpers/blacklisted");
/**
 * Register a new user
 * @param userData - User registration data
 * @returns Promise with created user document
 */
const registerUser = async (data) => {
    try {
        await (0, validate_1.validateUserData)(data);
        const userExists = await (0, user_1.checkUserExists)(data.email);
        if (userExists) {
            throw (0, http_errors_1.default)(409, "User already exists with this email");
        }
        const hashedPassword = await helpers.hashedPassword(data.password);
        const newUser = new userSchema_1.default({
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
    }
    catch (error) {
        if (error && typeof error === "object" && "status" in error)
            throw error;
        throw (0, http_errors_1.default)(500, `Failed to register user: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
};
exports.registerUser = registerUser;
/**
 * User login
 * @param loginData - User login data
 * @returns Promise with user document and JWT token
 */
const loginUser = async (loginData) => {
    try {
        await (0, validate_1.validateUserLoginData)(loginData);
        const user = await userSchema_1.default.findOne({
            username: loginData.username.toLowerCase(),
            isActive: true,
        }).select("+password");
        if (!user) {
            throw (0, http_errors_1.default)(401, "Invalid username or password");
        }
        const isPasswordValid = await helpers.comparePassword(loginData.password, user.password);
        if (!isPasswordValid) {
            throw (0, http_errors_1.default)(401, "Invalid username or password");
        }
        await userSchema_1.default.findByIdAndUpdate(user._id, {
            lastLoginAt: new Date(),
        });
        return {
            user,
            token: await helpers.jwtSign({ id: user._id }),
        };
    }
    catch (error) {
        if (error && typeof error === "object" && "status" in error)
            throw error;
        throw (0, http_errors_1.default)(500, `Login failed: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
};
exports.loginUser = loginUser;
/**
 * Change user password
 * @param userId - User ID
 * @param passwordData - Current and new password data
 * @returns Promise with success message
 */
const changePassword = async (userId, passwordData) => {
    try {
        await (0, validate_1.validatePasswordChangeData)(passwordData);
        const user = await userSchema_1.default.findById(userId).select("+password");
        if (!user) {
            throw (0, http_errors_1.default)(404, "User not found");
        }
        const isCurrentPasswordValid = await helpers.comparePassword(passwordData.currentPassword, user.password);
        if (!isCurrentPasswordValid) {
            throw (0, http_errors_1.default)(401, "Current password is incorrect");
        }
        // Check if new password is different from current
        const isSamePassword = await helpers.comparePassword(passwordData.newPassword, user.password);
        if (isSamePassword) {
            throw (0, http_errors_1.default)(400, "New password must be different from current password");
        }
        const passwordStrength = helpers.isStrongPassword(passwordData.newPassword);
        if (!passwordStrength.isValid) {
            throw (0, http_errors_1.default)(400, passwordStrength.message);
        }
        const hashedNewPassword = await helpers.hashedPassword(passwordData.newPassword);
        await userSchema_1.default.findByIdAndUpdate(userId, {
            password: hashedNewPassword,
            lastPasswordChange: new Date(),
        });
        return {
            message: "Password changed successfully",
        };
    }
    catch (error) {
        if (error && typeof error === "object" && "status" in error)
            throw error;
        throw (0, http_errors_1.default)(500, `Password change failed: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
};
exports.changePassword = changePassword;
/**
 * Reset password (for admin or when user is logged in)
 * @param userId - User ID
 * @param newPassword - New password
 * @returns Promise with success message
 */
const resetPassword = async (userId, newPassword) => {
    try {
        const user = await userSchema_1.default.findById(userId);
        if (!user) {
            throw (0, http_errors_1.default)(404, "User not found");
        }
        // Validate password strength
        const passwordStrength = helpers.isStrongPassword(newPassword);
        if (!passwordStrength.isValid) {
            throw (0, http_errors_1.default)(400, passwordStrength.message);
        }
        // Hash new password
        const hashedNewPassword = await helpers.hashedPassword(newPassword);
        // Update password and set lastPasswordChange
        await userSchema_1.default.findByIdAndUpdate(userId, {
            password: hashedNewPassword,
            lastPasswordChange: new Date(),
            passwordResetRequested: false,
        });
        return {
            message: "Password reset successfully",
        };
    }
    catch (error) {
        if (error && typeof error === "object" && "status" in error)
            throw error;
        throw (0, http_errors_1.default)(500, `Password reset failed: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
};
exports.resetPassword = resetPassword;
/**
 * Logout user by blacklisting their JWT token
 * @param token - JWT token to blacklist
 * @param userId - User ID (optional, for logging)
 * @returns Promise with success message
 */
const logoutUser = async (token, userId) => {
    try {
        const decoded = await helpers.jwtVerify(token);
        if (!decoded || !decoded.id) {
            throw (0, http_errors_1.default)(401, "Invalid token");
        }
        await (0, blacklisted_1.blacklistToken)(token);
        if (userId) {
            await userSchema_1.default.findByIdAndUpdate(userId, {
                lastLoginAt: new Date(),
            });
        }
        return {
            message: "Logged out successfully",
        };
    }
    catch (error) {
        if (error && typeof error === "object" && "status" in error)
            throw error;
        throw (0, http_errors_1.default)(500, `Logout failed: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
};
exports.logoutUser = logoutUser;
/**
 * Logout from all devices (invalidate all tokens for a user)
 * @param userId - User ID
 * @returns Promise with success message
 */
const logoutAllDevices = async (userId) => {
    try {
        const user = await userSchema_1.default.findById(userId);
        if (!user) {
            throw (0, http_errors_1.default)(404, "User not found");
        }
        // Update lastPasswordChange to invalidate all existing tokens
        // This works because JWT tokens contain the user ID and are verified against user data
        await userSchema_1.default.findByIdAndUpdate(userId, {
            lastPasswordChange: new Date(),
        });
        return {
            message: "Logged out from all devices successfully",
        };
    }
    catch (error) {
        if (error && typeof error === "object" && "status" in error)
            throw error;
        throw (0, http_errors_1.default)(500, `Logout from all devices failed: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
};
exports.logoutAllDevices = logoutAllDevices;
//# sourceMappingURL=index.js.map