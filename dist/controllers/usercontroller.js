"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchUsersController = exports.getAllUsersController = exports.deleteAccount = exports.getPublicProfile = exports.findUserByEmailController = exports.updateProfilePictureController = exports.updateProfile = exports.getProfile = exports.getUserByUsernameController = exports.getUserByIdController = void 0;
const user_1 = require("../services/user");
const helper_1 = require("../helpers/helper");
const http_errors_1 = __importDefault(require("http-errors"));
/**
 * Get user by ID
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function
 */
const getUserByIdController = async (req, res, next) => {
    try {
        const { userId } = req.params;
        if (!userId) {
            return next((0, http_errors_1.default)(400, "User ID is required"));
        }
        const result = await (0, user_1.getUserById)(userId);
        return (0, helper_1.constructHttpErrorResponse)(result, null, 200)(res);
    }
    catch (error) {
        next(error);
    }
};
exports.getUserByIdController = getUserByIdController;
/**
 * Get user by username
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function
 */
const getUserByUsernameController = async (req, res, next) => {
    try {
        const { username } = req.params;
        if (!username) {
            return next((0, http_errors_1.default)(400, "Username is required"));
        }
        const user = await (0, user_1.getUserByUsername)(username);
        if (!user) {
            return next((0, http_errors_1.default)(404, "User not found"));
        }
        return (0, helper_1.constructHttpErrorResponse)({ user }, null, 200)(res);
    }
    catch (error) {
        next(error);
    }
};
exports.getUserByUsernameController = getUserByUsernameController;
/**
 * Get current user profile
 * @param req - Express request object (requires auth)
 * @param res - Express response object
 * @param next - Express next function
 */
const getProfile = async (req, res, next) => {
    try {
        if (!req.user?.id) {
            return next((0, http_errors_1.default)(401, "Authentication required"));
        }
        const result = await (0, user_1.getUserProfile)(req.user.id);
        return (0, helper_1.constructHttpErrorResponse)(result, null, 200)(res);
    }
    catch (error) {
        next(error);
    }
};
exports.getProfile = getProfile;
/**
 * Update user profile
 * @param req - Express request object (requires auth)
 * @param res - Express response object
 * @param next - Express next function
 */
const updateProfile = async (req, res, next) => {
    try {
        if (!req.user?.id) {
            return next((0, http_errors_1.default)(401, "Authentication required"));
        }
        const result = await (0, user_1.updateUserProfile)(req.user.id, req.body);
        return (0, helper_1.constructHttpErrorResponse)(result, null, 200)(res);
    }
    catch (error) {
        next(error);
    }
};
exports.updateProfile = updateProfile;
/**
 * Update user profile picture
 * @param req - Express request object (requires auth)
 * @param res - Express response object
 * @param next - Express next function
 */
const updateProfilePictureController = async (req, res, next) => {
    try {
        if (!req.user?.id) {
            return next((0, http_errors_1.default)(401, "Authentication required"));
        }
        const { profilePictureUrl } = req.body;
        if (!profilePictureUrl) {
            return next((0, http_errors_1.default)(400, "Profile picture URL is required"));
        }
        const result = await (0, user_1.updateProfilePicture)(req.user.id, profilePictureUrl);
        return (0, helper_1.constructHttpErrorResponse)(result, null, 200)(res);
    }
    catch (error) {
        next(error);
    }
};
exports.updateProfilePictureController = updateProfilePictureController;
/**
 * Find user by email (admin function)
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function
 */
const findUserByEmailController = async (req, res, next) => {
    try {
        const { email } = req.params;
        if (!email) {
            return next((0, http_errors_1.default)(400, "Email is required"));
        }
        const user = await (0, user_1.findUserByEmail)(email);
        if (!user) {
            return next((0, http_errors_1.default)(404, "User not found"));
        }
        return (0, helper_1.constructHttpErrorResponse)({ user }, null, 200)(res);
    }
    catch (error) {
        next(error);
    }
};
exports.findUserByEmailController = findUserByEmailController;
/**
 * Get user public profile (without sensitive data)
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function
 */
const getPublicProfile = async (req, res, next) => {
    try {
        const { identifier } = req.params;
        if (!identifier) {
            return next((0, http_errors_1.default)(400, "User identifier is required"));
        }
        let user;
        if (identifier.length === 24) {
            user = await (0, user_1.getUserById)(identifier);
        }
        else {
            user = await (0, user_1.getUserByUsername)(identifier);
        }
        if (!user) {
            return next((0, http_errors_1.default)(404, "User not found"));
        }
        const publicProfile = {
            id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            username: user.username,
            profilePicture: user.profilePicture,
        };
        return (0, helper_1.constructHttpErrorResponse)({ user: publicProfile }, null, 200)(res);
    }
    catch (error) {
        next(error);
    }
};
exports.getPublicProfile = getPublicProfile;
/**
 * Delete user account (placeholder - implement proper service)
 * @param req - Express request object (requires auth)
 * @param res - Express response object
 * @param next - Express next function
 */
const deleteAccount = async (req, res, next) => {
    try {
        if (!req.user?.id) {
            return next((0, http_errors_1.default)(401, "Authentication required"));
        }
        //  Implement deleteUser service function
        // For now, return a placeholder message
        const result = {
            message: "Account deletion requested. This feature will be implemented soon.",
            userId: req.user.id,
        };
        return (0, helper_1.constructHttpErrorResponse)(result, null, 200)(res);
    }
    catch (error) {
        next(error);
    }
};
exports.deleteAccount = deleteAccount;
/**
 * Get all users (admin function)
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function
 */
const getAllUsersController = async (req, res, next) => {
    try {
        const result = {
            message: "Get all users functionality will be implemented soon.",
            users: [],
        };
        return (0, helper_1.constructHttpErrorResponse)(result, null, 200)(res);
    }
    catch (error) {
        next(error);
    }
};
exports.getAllUsersController = getAllUsersController;
/**
 * Search users by criteria
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function
 */
const searchUsersController = async (req, res, next) => {
    try {
        const { q } = req.query;
        if (!q) {
            return next((0, http_errors_1.default)(400, "Search query is required"));
        }
        const result = {
            message: "User search functionality will be implemented soon.",
            query: q,
            results: [],
        };
        return (0, helper_1.constructHttpErrorResponse)(result, null, 200)(res);
    }
    catch (error) {
        next(error);
    }
};
exports.searchUsersController = searchUsersController;
//# sourceMappingURL=usercontroller.js.map