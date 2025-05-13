import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(20),
});

const registerSchema = z.object({
  name: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(8).max(20),
});

const updateProfile = z.object({
  name: z.string().min(3),
  email: z.string().email(),
});

const updateProfilePassword = z
  .object({
    oldPassword: z.string().min(8).max(20),
    password: z.string().min(8).max(20),
    confirmPassword: z.string().min(8).max(20),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

const resetPasswordSchema = z
  .object({
    password: z.string().min(8).max(20),
    confirmPassword: z.string().min(8).max(20),
    token: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

const forgotPasswordSchema = z.object({
  email: z.string().email(),
});

export default {
  loginSchema,
  registerSchema,
  updateProfile,
  updateProfilePassword,
  forgotPasswordSchema,
  resetPasswordSchema,
};
