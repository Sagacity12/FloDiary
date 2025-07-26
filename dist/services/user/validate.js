"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateOTPVerificationData = exports.validatePasswordChangeData = exports.validateUserProfileUpdateData = exports.validateUserLoginData = exports.validateUserData = void 0;
const ajv_1 = __importDefault(require("ajv"));
const ajv_formats_1 = __importDefault(require("ajv-formats"));
const http_errors_1 = __importDefault(require("http-errors"));
/**
 * validate only the sign up and login in data before creating a user
 * @param data - The data to validate
 */
const validateUserData = (data) => {
    const ajv = new ajv_1.default();
    (0, ajv_formats_1.default)(ajv);
    ajv.addFormat("email", {
        type: "string",
        validate: (email) => {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email);
        }
    });
    const schema = {
        type: "object",
        properties: {
            firstName: { type: "string", minLength: 2, maxLength: 50 },
            lastName: { type: "string", minLength: 2, maxLength: 50 },
            username: { type: "string", minLength: 3, maxLength: 20 },
            email: { type: "string", format: "email" },
            password: { type: "string", minLength: 8, maxLength: 100 }
        },
        required: ["firstName", "lastName", "username", "email", "password"],
        additionalProperties: false
    };
    const validate = ajv.compile(schema);
    const valid = validate(data);
    if (!valid) {
        throw (0, http_errors_1.default)(400, "Invalid user data", {
            errors: validate.errors
        });
    }
    ;
};
exports.validateUserData = validateUserData;
/**
 * Validate user login data
 * @param data - The data to validate
 */
const validateUserLoginData = (data) => {
    const ajv = new ajv_1.default();
    (0, ajv_formats_1.default)(ajv);
    ajv.addFormat("username", {
        type: "string",
        validate: (username) => {
            const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
            return usernameRegex.test(username);
        }
    });
    const schema = {
        type: "object",
        properties: {
            username: { type: "string", minLength: 3, maxLength: 20 },
            password: { type: "string", minLength: 8, maxLength: 100 }
        },
        required: ["username", "password"],
        additionalProperties: false
    };
    const validate = ajv.compile(schema);
    const valid = validate(data);
    if (!valid) {
        throw (0, http_errors_1.default)(400, "Invalid user login data", {
            errors: validate.errors
        });
    }
};
exports.validateUserLoginData = validateUserLoginData;
/**
 * Validate user profile update data
 * @param data - The data to validate
 */
const validateUserProfileUpdateData = (data) => {
    const ajv = new ajv_1.default();
    (0, ajv_formats_1.default)(ajv);
    ajv.addFormat("email", {
        type: "string",
        validate: (email) => {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email);
        }
    });
    const schema = {
        type: "object",
        properties: {
            firstName: { type: "string", minLength: 2, maxLength: 50 },
            lastName: { type: "string", minLength: 2, maxLength: 50 },
            username: { type: "string", minLength: 3, maxLength: 20 },
            email: { type: "string", format: "email" },
            profilePicture: { type: "string", format: "uri" }
        },
        required: ["firstName", "lastName", "username", "email"],
        additionalProperties: false
    };
    const validate = ajv.compile(schema);
    const valid = validate(data);
    if (!valid) {
        throw (0, http_errors_1.default)(400, "Invalid user profile update data", {
            errors: validate.errors
        });
    }
};
exports.validateUserProfileUpdateData = validateUserProfileUpdateData;
/**
 * Validate password change data
 * @param data - The data to validate
 */
const validatePasswordChangeData = (data) => {
    const ajv = new ajv_1.default();
    (0, ajv_formats_1.default)(ajv);
    const schema = {
        type: "object",
        properties: {
            currentPassword: { type: "string", minLength: 8, maxLength: 100 },
            newPassword: { type: "string", minLength: 8, maxLength: 100 },
        },
        required: ["currentPassword", "newPassword"],
        additionalProperties: false
    };
    const validate = ajv.compile(schema);
    const isValid = validate(data);
    if (!isValid) {
        const errors = validate.errors?.map((error) => {
            const field = error.instancePath.replace("/", "") ||
                error.params?.missingProperty ||
                "unknown field";
            return {
                field: field,
                message: `${field}: ${error.message}`,
            };
        });
        throw new http_errors_1.default.BadRequest(JSON.stringify({
            message: "Invalid password change data",
            errors,
        }));
    }
};
exports.validatePasswordChangeData = validatePasswordChangeData;
/**
 * Validate OTP verification data
 * @param data - The data to validate
 */
const validateOTPVerificationData = (data) => {
    const ajv = new ajv_1.default();
    (0, ajv_formats_1.default)(ajv);
    ajv.addFormat("email", {
        type: "string",
        validate: (email) => {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email);
        },
    });
    const schema = {
        type: "object",
        properties: {
            otp: { type: "string", minLength: 6, maxLength: 6 },
            email: { type: "string", format: "email" }
        },
        required: ["otp", "email"],
        additionalProperties: false
    };
    const validate = ajv.compile(schema);
    const isValid = validate(data);
    if (!isValid) {
        throw (0, http_errors_1.default)(400, "Invalid OTP verification data", {
            errors: validate.errors
        });
    }
};
exports.validateOTPVerificationData = validateOTPVerificationData;
//# sourceMappingURL=validate.js.map