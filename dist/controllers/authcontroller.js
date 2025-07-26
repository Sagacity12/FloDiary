"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.logoutAll = exports.logout = exports.resetUserPassword = exports.getProfile = exports.login = exports.register = void 0;
const auth_1 = require("../services/auth");
const user_1 = require("../services/user");
const helper_1 = require("../helpers/helper");
const http_errors_1 = __importDefault(require("http-errors"));
/**
 * Register a new user
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function
 */
const register = async (req, res, next) => {
    try {
        const result = await (0, auth_1.registerUser)(req.body);
        return (0, helper_1.constructHttpErrorResponse)(result, null, 201)(res);
    }
    catch (error) {
        next(error);
    }
};
exports.register = register;
/**
 * Login user
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function
 */
const login = async (req, res, next) => {
    try {
        const result = await (0, auth_1.loginUser)(req.body);
        return (0, helper_1.constructHttpErrorResponse)(result, null, 200)(res);
    }
    catch (error) {
        next(error);
    }
};
exports.login = login;
/**
 * Change user password
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
 * Reset user password (admin function)
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function
 */
const resetUserPassword = async (req, res, next) => {
    try {
        const { userId } = req.params;
        const { newPassword } = req.body;
        if (!userId || !newPassword) {
            return next((0, http_errors_1.default)(400, "User ID and new password are required"));
        }
        const result = await (0, auth_1.resetPassword)(userId, newPassword);
        return (0, helper_1.constructHttpErrorResponse)(result, null, 200)(res);
    }
    catch (error) {
        next(error);
    }
};
exports.resetUserPassword = resetUserPassword;
/**
 * Logout user from current device
 * @param req - Express request object (requires auth)
 * @param res - Express response object
 * @param next - Express next function
 */
const logout = async (req, res, next) => {
    try {
        if (!req.token) {
            return next((0, http_errors_1.default)(401, "Authentication token required"));
        }
        const result = await (0, auth_1.logoutUser)(req.token, req.user?.id);
        return (0, helper_1.constructHttpErrorResponse)(result, null, 200)(res);
    }
    catch (error) {
        next(error);
    }
};
exports.logout = logout;
/**
 * Logout user from all devices
 * @param req - Express request object (requires auth)
 * @param res - Express response object
 * @param next - Express next function
 */
const logoutAll = async (req, res, next) => {
    try {
        if (!req.user?.id) {
            return next((0, http_errors_1.default)(401, "Authentication required"));
        }
        const result = await (0, auth_1.logoutAllDevices)(req.user.id);
        return (0, helper_1.constructHttpErrorResponse)(result, null, 200)(res);
    }
    catch (error) {
        next(error);
    }
};
exports.logoutAll = logoutAll;
/**
 * Verify token validity (health check for frontend)
 * @param req - Express request object (requires auth)
 * @param res - Express response object
 * @param next - Express next function
 */
const verifyToken = async (req, res, next) => {
    try {
        if (!req.user?.id) {
            return next((0, http_errors_1.default)(401, "Invalid token"));
        }
        const result = {
            userId: req.user.id,
            isValid: true,
            message: "Token is valid",
        };
        return (0, helper_1.constructHttpErrorResponse)(result, null, 200)(res);
    }
    catch (error) {
        next(error);
    }
};
exports.verifyToken = verifyToken;
//# sourceMappingURL=authcontroller.js.map