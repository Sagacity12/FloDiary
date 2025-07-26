import { Document, Types } from "mongoose";

export interface User {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
  passwordResetRequested: boolean;
  otpVerified: boolean;
  lastPasswordChange?: Date;
  isEmailVerified?: boolean;
  tempOTP?: string;
  tempOTPExpiry?: Date;
  profilePicture?: string;
  updatedAt?: string;
  lastLoginAt?: string;
  isActive?: string;
}

export interface IUserDocument extends User, Document {}

export interface IUserRegistration {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
  tempOTP?: string;
  tempOTPExpiry?: Date;
}

export interface UserLogin {
  username: string;
  password: string;
}

export interface updatePasswordInput {
  id: string;
  password: string;
}

export interface UserProfileUpdate {
  firstName: string;
  LastName: string;
  email: string;
  username: string;
  profilepicture?: string;
}

export interface IPasswordChange {
  currentPassword: string;
  newPassword: string;
}
