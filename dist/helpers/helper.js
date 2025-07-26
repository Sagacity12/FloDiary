"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.constructHttpErrorResponse = exports.isStrongPassword = exports.canRequestOTP = exports.generateSecureToken = exports.verifyTimedOTP = exports.generateTimedOTP = exports.generateOTP = exports.jwtVerify = exports.jwtSign = exports.comparePassword = exports.hashedPassword = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
/**
 * Function to hash a password using bcrypt.
 * @param password - The password to hash.
 * @returns A promise that resolves to the hashed password.
 */
const hashedPassword = async (password) => {
    const saltRounds = 10;
    const hashedPassword = await bcrypt_1.default.hash(password, saltRounds);
    return hashedPassword;
};
exports.hashedPassword = hashedPassword;
/**
 * Function to compare a password with a hashed password.
 * @param password - The plain text password.
 * @param hashedPassword - The hashed password to compare against.
 * @returns A promise that resolves to a boolean indicating if the passwords match.
 */
const comparePassword = async (password, hashedPassword) => {
    const isMatch = await bcrypt_1.default.compare(password, hashedPassword);
    return isMatch;
};
exports.comparePassword = comparePassword;
/**
 * JWT sign function to create a token.
 * @returns A function that takes a payload and returns a signed JWT.
 */
const jwtSign = async (payload) => {
    return jsonwebtoken_1.default.sign(payload, `${process.env.JWT_SECRET}`, { expiresIn: "1d" });
};
exports.jwtSign = jwtSign;
/**
 * JWT verify function to validate a token.
 * @returns A function that takes a token and returns the decoded payload.
 */
const jwtVerify = async (token) => {
    return jsonwebtoken_1.default.verify(token, `${process.env.JWT_SECRET}`);
};
exports.jwtVerify = jwtVerify;
/**
 * generate a random string of specified length.
 * @param length - The length of the random string to generate.
 * @returns A promise that resolves to a random string.
 */
const generateOTP = (length) => {
    const digits = '0123456789';
    const Length = digits.length;
    let otp = '';
    for (let i = 0; i < length; i++) {
        otp += digits.charAt(Math.floor(Math.random() * Length));
    }
    return otp;
};
exports.generateOTP = generateOTP;
/**
 * Generate timeed OTP with expiration
 * @param lenght - The length of the OTP to generate.
 * @returns An object containing the OTP and its expiration time.
 */
const generateTimedOTP = (length) => {
    const otp = (0, exports.generateOTP)(length);
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);
    return { otp, expiresAt };
};
exports.generateTimedOTP = generateTimedOTP;
/**
 * Verify time OTP with expiration check
 * @param inputOTP - The OTP entered by user
 * @param storedOTP -  The OTP stored in database
 * @param expiresAt - When the OTP expires
 * @returns Verification result
 */
const verifyTimedOTP = (inputOTP, storedOTP, expiresAt) => {
    if (new Date() > expiresAt) {
        return {
            isValid: false,
            message: "OTP has expired. Please request a new one",
        };
    }
    if (inputOTP === storedOTP) {
        return { isValid: true, message: "OTP verified successfully" };
    }
    else {
        return { isValid: false, message: "Invalid OTP. Please try again" };
    }
};
exports.verifyTimedOTP = verifyTimedOTP;
/**
 * Generate secure token for email verification
 * @param length - Token length in bytes
 * @returns Secure random token
 */
const generateSecureToken = (length = 32) => {
    const crypto = require('crypto');
    return crypto.randomBytes(length).toString('hex');
};
exports.generateSecureToken = generateSecureToken;
/**
 * Rate limiting helper for OTP requests
 * @param lastRequestTime - When OTP was last requested
 * @param cooldownMinutes - Cool period in minutes
 * @returns Whether new OTP can be requested
 */
const canRequestOTP = (lastRequestTime, cooldownMinutes = 5) => {
    const now = new Date();
    const timeDiff = now.getTime() - lastRequestTime.getTime();
    const cooldownMillis = cooldownMinutes * 60 * 1000;
    return timeDiff >= cooldownMillis;
};
exports.canRequestOTP = canRequestOTP;
/**
 * Password strength validation
 * @param password - The password to validate.
 * @returns A boolean indicating whether the password is strong enough.
 */
const isStrongPassword = (password) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChars = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    if (password.length < minLength) {
        return { isValid: false, message: `Password must be at least ${minLength} characters long.` };
    }
    if (!hasUpperCase) {
        return { isValid: false, message: 'Password must contain at least one uppercase letter.' };
    }
    if (!hasLowerCase) {
        return { isValid: false, message: 'Password must contain at least one lowercase letter.' };
    }
    if (!hasNumbers) {
        return { isValid: false, message: 'Password must contain at least one number.' };
    }
    if (!hasSpecialChars) {
        return { isValid: false, message: 'Password must contain at least one special character.' };
    }
    return { isValid: true, message: 'Password is strong.' };
};
exports.isStrongPassword = isStrongPassword;
/**
 * Construct Http Error
 * @param data
 * @param error
 * @param statusCode
 * @return
 */
const constructHttpErrorResponse = (data = null, error = null, statusCode = 200) => {
    return (res) => {
        if (error) {
            return res.status(statusCode).json({
                error: {
                    message: error.message,
                    statusCode: error.statusCode || statusCode
                }
            });
        }
        return res.status(statusCode).json({
            data,
            statusCode
        });
    };
};
exports.constructHttpErrorResponse = constructHttpErrorResponse;
//# sourceMappingURL=helper.js.map