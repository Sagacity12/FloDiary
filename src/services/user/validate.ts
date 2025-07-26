import Ajv from "ajv";
import addFormat from "ajv-formats";
import createHttpError from "http-errors";
import { IUserRegistration, UserProfileUpdate, UserLogin } from "src/common/interfaces/user";

/**
 * validate only the sign up and login in data before creating a user
 * @param data - The data to validate
 */
export const validateUserData = (data: IUserRegistration) => {
    const ajv = new Ajv();
    addFormat(ajv);
    ajv.addFormat("email", {
        type: "string",
        validate: (email: string) => {
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
        throw createHttpError(400, "Invalid user data", {
            errors: validate.errors
        });
    };
};

/**
 * Validate user login data
 * @param data - The data to validate
 */
export const validateUserLoginData = (data: UserLogin) => {
    const ajv = new Ajv();
    addFormat(ajv);

   
    ajv.addFormat("username", {
        type: "string",
        validate: (username: string) => {
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
        throw createHttpError(400, "Invalid user login data", {
            errors: validate.errors
        });
    }
};

/**
 * Validate user profile update data
 * @param data - The data to validate
 */
export const validateUserProfileUpdateData = (data: UserProfileUpdate) => {
    const ajv = new Ajv();
    addFormat(ajv);

    ajv.addFormat("email", {
        type: "string",
        validate: (email: string) => {
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
        throw createHttpError(400, "Invalid user profile update data", {
            errors: validate.errors
        });
    }
};

/**
 * Validate password change data
 * @param data - The data to validate
 */
export const validatePasswordChangeData = (data: { currentPassword: string; newPassword: string }) => {
    const ajv = new Ajv();
    addFormat(ajv);

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
        const field = 
            error.instancePath.replace("/", "") ||
            error.params?.missingProperty ||
            "unknown field";
        return {
            field: field,
            message: `${field}: ${error.message}`,
        }
      });
      throw new createHttpError.BadRequest(
        JSON.stringify({    
            message: "Invalid password change data",
            errors,
        })
     );
    }
};

/**
 * Validate OTP verification data
 * @param data - The data to validate
 */
export const validateOTPVerificationData = (data: { otp: string; email: string; }) => {
    const ajv = new Ajv();
    addFormat(ajv);

    ajv.addFormat("email", {
        type: "string",
        validate: (email: string) => {
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
        throw createHttpError(400, "Invalid OTP verification data", {
            errors: validate.errors
        });
    }
}; 
