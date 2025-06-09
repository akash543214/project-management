import { z } from 'zod';
import { Request, Response } from "express";
import ApiError from '../utils/apiError';
import { NextFunction } from 'express';
// Registration Schema
export const RegisterUserSchema = z.object({
    name: z
        .string()
        .trim()
        .min(2, "Name must be at least 2 characters long")
        .max(100, "Name must be less than 100 characters")
        .regex(/^[a-zA-Z\s\-'\.]+$/, "Name can only contain letters, spaces, hyphens, apostrophes, and periods"),
    
    email: z
        .string()
        .trim()
        .toLowerCase()
        .email("Invalid email format")
        .max(254, "Email must be less than 254 characters"),
    
    password: z
        .string()
        .min(8, "Password must be at least 8 characters long")
        .max(128, "Password must be less than 128 characters")
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
        .regex(/[a-z]/, "Password must contain at least one lowercase letter")
        .regex(/\d/, "Password must contain at least one number")
        .refine((password) => {
            const commonPasswords = [
                'password', '12345678', 'qwerty123', 'admin123', 
                'welcome123', 'password123', '123456789'
            ];
            return !commonPasswords.includes(password.toLowerCase());
        }, "Password is too common, please choose a stronger password")
});

// Login Schema
export const LoginUserSchema = z.object({
    email: z
        .string()
        .trim()
        .toLowerCase()
        .email("Invalid email format")
        .max(254, "Email must be less than 254 characters"),
    
    password: z
        .string()
        .min(1, "Password is required")
        .max(128, "Password is too long")
});

// Password Reset Request Schema
export const PasswordResetRequestSchema = z.object({
    email: z
        .string()
        .trim()
        .toLowerCase()
        .email("Invalid email format")
});

// Password Reset Schema
export const PasswordResetSchema = z.object({
    token: z
        .string()
        .min(1, "Reset token is required"),
    
    newPassword: z
        .string()
        .min(8, "Password must be at least 8 characters long")
        .max(128, "Password must be less than 128 characters")
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
        .regex(/[a-z]/, "Password must contain at least one lowercase letter")
        .regex(/\d/, "Password must contain at least one number")
});

// Change Password Schema
export const ChangePasswordSchema = z.object({
    currentPassword: z
        .string()
        .min(1, "Current password is required"),
    
    newPassword: z
        .string()
        .min(8, "New password must be at least 8 characters long")
        .max(128, "New password must be less than 128 characters")
        .regex(/[A-Z]/, "New password must contain at least one uppercase letter")
        .regex(/[a-z]/, "New password must contain at least one lowercase letter")
        .regex(/\d/, "New password must contain at least one number")
}).refine((data) => data.currentPassword !== data.newPassword, {
    message: "New password must be different from current password",
    path: ["newPassword"]
});

// Email Verification Schema
export const EmailVerificationSchema = z.object({
    token: z
        .string()
        .min(1, "Verification token is required")
});

// Update Profile Schema
export const UpdateProfileSchema = z.object({
    name: z
        .string()
        .trim()
        .min(2, "Name must be at least 2 characters long")
        .max(100, "Name must be less than 100 characters")
        .regex(/^[a-zA-Z\s\-'\.]+$/, "Name can only contain letters, spaces, hyphens, apostrophes, and periods")
        .optional(),
    
    email: z
        .string()
        .trim()
        .toLowerCase()
        .email("Invalid email format")
        .max(254, "Email must be less than 254 characters")
        .optional()
}).refine((data) => data.name || data.email, {
    message: "At least one field (name or email) must be provided"
});

// TypeScript types inferred from schemas
export type RegisterUserRequest = z.infer<typeof RegisterUserSchema>;
export type LoginUserRequest = z.infer<typeof LoginUserSchema>;
export type PasswordResetRequestType = z.infer<typeof PasswordResetRequestSchema>;
export type PasswordResetType = z.infer<typeof PasswordResetSchema>;
export type ChangePasswordType = z.infer<typeof ChangePasswordSchema>;
export type EmailVerificationType = z.infer<typeof EmailVerificationSchema>;
export type UpdateProfileType = z.infer<typeof UpdateProfileSchema>;

// Generic validation middleware factory
export const createValidationMiddleware = (schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const validatedData = schema.parse(req.body);
      req.body = validatedData;
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const firstError = error.errors[0];
        // Throw custom ApiError with first validation message
        throw new ApiError(firstError.message, 400);
      }
      throw new ApiError('Invalid input data', 400);
    }
  };
};

