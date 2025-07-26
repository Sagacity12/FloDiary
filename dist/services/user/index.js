"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProfilePicture = exports.updateUserProfile = exports.getUserProfile = exports.findUserByEmail = exports.checkUserExists = exports.getUserByUsername = exports.getUserById = void 0;
const mongoose_1 = require("mongoose");
const userSchema_1 = __importDefault(require("../../models/userSchema"));
const validate_1 = require("./validate");
const http_errors_1 = __importDefault(require("http-errors"));
/**
 * Get user by ID
 * @param userId - User ID
 * @returns Promise with user data
 */
const getUserById = async (userId) => {
    try {
        if (!mongoose_1.Types.ObjectId.isValid(userId)) {
            throw (0, http_errors_1.default)(400, "Invalid user ID format");
        }
        const user = await userSchema_1.default.findById(userId);
        if (!user) {
            throw (0, http_errors_1.default)(404, "User not found");
        }
        return user;
    }
    catch (error) {
        if (error.status)
            throw error;
        throw (0, http_errors_1.default)(500, `Failed to get user: ${error.message}`);
    }
};
exports.getUserById = getUserById;
/**
 * Get user by username
 * @param username - User username
 * @returns Promise with user data or null if not found
 */
const getUserByUsername = async (username) => {
    try {
        return await userSchema_1.default.findOne({ username: username.toLowerCase() });
    }
    catch (error) {
        throw (0, http_errors_1.default)(500, `Failed to get user by username: ${error.message}`);
    }
};
exports.getUserByUsername = getUserByUsername;
/**
 * Check if user already exists by email
 * @param email - User email
 * @param phone - User phone (optional)
 * @returns Promise<boolean>
 */
const checkUserExists = async (email, phone) => {
    try {
        const query = phone
            ? { $or: [{ email: email.toLowerCase() }, { phone }] }
            : { email: email.toLowerCase() };
        const existingUser = await userSchema_1.default.findOne(query);
        return !!existingUser;
    }
    catch (error) {
        throw (0, http_errors_1.default)(500, `Failed to check user existence: ${error.message}`);
    }
};
exports.checkUserExists = checkUserExists;
/**
 * Find user by email
 * @param email - User email
 * @returns Promise with user or null
 */
const findUserByEmail = async (email) => {
    try {
        return await userSchema_1.default.findOne({
            email: email.toLowerCase(),
            isActive: true,
        });
    }
    catch (error) {
        throw (0, http_errors_1.default)(500, `Failed to find user: ${error.message}`);
    }
};
exports.findUserByEmail = findUserByEmail;
/**
 * Get user profile by ID (without sensitive fields)
 * @param userId - User ID
 * @returns Promise with user profile data
 */
const getUserProfile = async (userId) => {
    try {
        const user = await userSchema_1.default.findById(userId).select("-password -tempOTP -tempOTPExpiry");
        if (!user) {
            throw (0, http_errors_1.default)(404, "User profile not found");
        }
        return {
            user,
            message: "Profile retrieved successfully",
        };
    }
    catch (error) {
        if (error.status)
            throw error;
        throw (0, http_errors_1.default)(500, `Failed to get user profile: ${error.message}`);
    }
};
exports.getUserProfile = getUserProfile;
/**
 * Update User profile
 * @param update userprofile - User profile
 * @returns - User profile updated
 */
const updateUserProfile = async (userId, updateData) => {
    try {
        await (0, validate_1.validateUserProfileUpdateData)(updateData);
        const currentUser = await userSchema_1.default.findById(userId).select("+password").exec();
        if (!currentUser) {
            throw (0, http_errors_1.default)(404, "User not found");
        }
        if (updateData.email && updateData.email !== currentUser.email) {
            const emailExists = await (0, exports.checkUserExists)(updateData.email);
            if (emailExists) {
                throw (0, http_errors_1.default)(409, "Email already exists");
            }
        }
        const updateObject = { ...updateData };
        const updatedUser = await userSchema_1.default.findByIdAndUpdate(userId, updateObject, {
            new: true,
            runValidators: true,
        }).select("-password -tempOTP -tempOTPExpiry");
        if (!updatedUser) {
            throw (0, http_errors_1.default)(500, "Failed to update profile");
        }
        return {
            user: updatedUser,
            message: "Profile updated successfully",
        };
    }
    catch (error) {
        if (error instanceof Error && "status" in error)
            throw error;
        const message = error instanceof Error ? error.message : "Unknown error";
        throw (0, http_errors_1.default)(500, `Failed to update profile: ${message}`);
    }
};
exports.updateUserProfile = updateUserProfile;
/**
 * Update user profile picture
 * @param userId - User ID
 * @param profilePictureUrl - Profile picture URL
 * @returns Promise with updated user
 */
const updateProfilePicture = async (userId, profilePictureUrl) => {
    try {
        const urlRegex = /^https?:\/\/.+/;
        if (!urlRegex.test(profilePictureUrl)) {
            throw (0, http_errors_1.default)(400, "Invalid profile picture URL format");
        }
        const updatedUser = await userSchema_1.default.findByIdAndUpdate(userId, { profilePicture: profilePictureUrl }, { new: true }).select("-password -tempOTP -tempOTPExpiry");
        if (!updatedUser) {
            throw (0, http_errors_1.default)(404, "User not found");
        }
        return {
            user: updatedUser,
            message: "Profile picture updated successfully",
        };
    }
    catch (error) {
        if (error.status)
            throw error;
        throw (0, http_errors_1.default)(500, `Failed to update profile picture: ${error.message}`);
    }
};
exports.updateProfilePicture = updateProfilePicture;
//# sourceMappingURL=index.js.map