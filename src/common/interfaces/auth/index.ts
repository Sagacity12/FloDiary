import { Types } from 'mongoose';

export interface IAuthResponse {
  success: boolean;
  message: string;
  user?: IAuthUser;
  token?: string;
  refreshToken?: string;
}

export interface IAuthUser {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  isEmailVerified?: boolean;
  isPhoneVerified?: boolean;
  profilePicture?: string;
  createdAt?: Date;
  lastLoginAt?: Date;
}

export interface IRegisterRequest {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
  confirmPassword?: string;
  termsAccepted?: boolean;
}

export interface ILoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface IPasswordResetRequest {
  email: string;
}

export interface IPasswordReset {
  email: string;
  resetToken: string;
  newPassword: string;
  confirmPassword: string;
}

export interface IRefreshTokenRequest {
  refreshToken?: string;
}

export interface Auth {
  _id: Types.ObjectId;
  userId: string | Types.ObjectId;
  token?: string;
  refreshToken?: string;
  expiresAt?: Date;
  expiresIn?: Date;
}