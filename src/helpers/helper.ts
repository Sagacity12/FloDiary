import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import createHttpError, { HttpError } from "http-errors";

/**
 * Function to hash a password using bcrypt.
 * @param password - The password to hash.
 * @returns A promise that resolves to the hashed password.
 */
export const hashedPassword = async (password: string) => {
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
};
/**
 * Function to compare a password with a hashed password.
 * @param password - The plain text password.
 * @param hashedPassword - The hashed password to compare against.
 * @returns A promise that resolves to a boolean indicating if the passwords match.
 */
export const comparePassword = async (
  password: string,
  hashedPassword: string
) => {
  const isMatch = await bcrypt.compare(password, hashedPassword);
  return isMatch;
};

/**
 * JWT sign function to create a token.
 * @returns A function that takes a payload and returns a signed JWT.
 */
export const jwtSign = async (payload: object) => {
  return jwt.sign(payload, `${process.env.JWT_SECRET}`, { expiresIn: "1d" });
};
/**
 * JWT verify function to validate a token.
 * @returns A function that takes a token and returns the decoded payload.
 */
export const jwtVerify = async (token: string): Promise<any> => {
  return jwt.verify(token, `${process.env.JWT_SECRET}`);
};

/**
 * generate a random string of specified length.
 * @param length - The length of the random string to generate.
 * @returns A promise that resolves to a random string.
 */
export const generateOTP = (length: number): string => {
  const digits = '0123456789';
  const Length = digits.length;
  let otp = '';
  for (let i = 0; i < length; i++) {
    otp += digits.charAt(Math.floor(Math.random() * Length));
  }
  return otp
};

/**
 * Generate timeed OTP with expiration
 * @param lenght - The length of the OTP to generate.
 * @returns An object containing the OTP and its expiration time.
 */
export const generateTimedOTP = (length: number): { otp: string; expiresAt: Date } => {
  const otp = generateOTP(length);
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000);
  return { otp, expiresAt };
};

/**
 * Verify time OTP with expiration check
 * @param inputOTP - The OTP entered by user 
 * @param storedOTP -  The OTP stored in database 
 * @param expiresAt - When the OTP expires
 * @returns Verification result
 */
export const verifyTimedOTP = (
  inputOTP: string,
  storedOTP: string,
  expiresAt: Date
): { isValid: boolean; message: string } => {
  if (new Date() > expiresAt) {
    return {
      isValid: false,
      message: "OTP has expired. Please request a new one",
    };
  }

  if (inputOTP === storedOTP) {
    return { isValid: true, message: "OTP verified successfully" };
  } else {
    return { isValid: false, message: "Invalid OTP. Please try again" };
  }
};

/**
 * Generate secure token for email verification
 * @param length - Token length in bytes
 * @returns Secure random token
 */
export const generateSecureToken = (length: number = 32): string => {
    const crypto = require('crypto');
    return crypto.randomBytes(length).toString('hex'); 
}

/**
 * Rate limiting helper for OTP requests 
 * @param lastRequestTime - When OTP was last requested 
 * @param cooldownMinutes - Cool period in minutes
 * @returns Whether new OTP can be requested
 */
export const canRequestOTP = (lastRequestTime: Date, cooldownMinutes: number = 5): boolean => {
    const now = new Date();
    const timeDiff = now.getTime() - lastRequestTime.getTime();
    const cooldownMillis = cooldownMinutes * 60 * 1000;
    return timeDiff >= cooldownMillis;
};

/**
 * Password strength validation
 * @param password - The password to validate.
 * @returns A boolean indicating whether the password is strong enough.
 */
export const isStrongPassword = (password: string): { isValid: boolean; message: string } => {
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
}

/**
 * Construct Http Error 
 * @param data 
 * @param error
 * @param statusCode 
 * @return 
 */
export const constructHttpErrorResponse = (
    data: any = null,
    error: null | HttpError = null,
    statusCode: number = 200
) => {
    return (res: Response) => {
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
    }
};