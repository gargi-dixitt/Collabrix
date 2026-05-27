import { ZodError } from "zod";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import User from "../models/User.js";

import {
  registerSchema,
  loginSchema,
} from "../validators/authValidator.js";

/*
|--------------------------------------------------------------------------
| Generate JWT Token
|--------------------------------------------------------------------------
*/

const generateToken = (userId) => {
  if (!process.env.JWT_SECRET) {
    throw new Error(
      "JWT_SECRET is missing from environment variables"
    );
  }

  return jwt.sign(
    {
      id: userId,
    },

    process.env.JWT_SECRET,

    {
      expiresIn: "7d",
    }
  );
};

/*
|--------------------------------------------------------------------------
| Format Safe User Response
|--------------------------------------------------------------------------
*/

const sanitizeUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  avatar: user.avatar || "",
  createdAt: user.createdAt,
});

/*
|--------------------------------------------------------------------------
| Register User
|--------------------------------------------------------------------------
| POST /api/auth/register
|--------------------------------------------------------------------------
*/

export const registerUser = async (
  req,
  res,
  next
) => {
  try {
    /*
    |--------------------------------------------------------------------------
    | Validate Request Body
    |--------------------------------------------------------------------------
    */

    const validatedData =
      registerSchema.parse(req.body);

    /*
    |--------------------------------------------------------------------------
    | Normalize Email
    |--------------------------------------------------------------------------
    */

    const normalizedEmail =
      validatedData.email
        .trim()
        .toLowerCase();

    /*
    |--------------------------------------------------------------------------
    | Check Existing User
    |--------------------------------------------------------------------------
    */

    const existingUser =
      await User.findOne({
        email: normalizedEmail,
      });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message:
          "An account with this email already exists.",
      });
    }

    /*
    |--------------------------------------------------------------------------
    | Hash Password
    |--------------------------------------------------------------------------
    */

    const hashedPassword =
      await bcrypt.hash(
        validatedData.password,
        10
      );

    /*
    |--------------------------------------------------------------------------
    | Create User
    |--------------------------------------------------------------------------
    */

    const user = await User.create({
      name: validatedData.name.trim(),

      email: normalizedEmail,

      password: hashedPassword,
    });

    /*
    |--------------------------------------------------------------------------
    | Generate JWT
    |--------------------------------------------------------------------------
    */

    const token = generateToken(
      user._id
    );

    /*
    |--------------------------------------------------------------------------
    | Success Response
    |--------------------------------------------------------------------------
    */

    return res.status(201).json({
      success: true,

      message:
        "Account created successfully.",

      token,

      user: sanitizeUser(user),
    });
  } catch (error) {
    /*
    |--------------------------------------------------------------------------
    | Validation Errors
    |--------------------------------------------------------------------------
    */

    if (error instanceof ZodError) {
      return res.status(400).json({
        success: false,
        message:
          error.errors?.[0]?.message ||
          "Invalid registration data.",
      });
    }

    /*
    |--------------------------------------------------------------------------
    | Mongo Duplicate Key
    |--------------------------------------------------------------------------
    */

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message:
          "Email already registered.",
      });
    }

    /*
    |--------------------------------------------------------------------------
    | Unexpected Errors
    |--------------------------------------------------------------------------
    */

    console.error(
      "Register error:",
      error
    );

    return next(error);
  }
};

/*
|--------------------------------------------------------------------------
| Login User
|--------------------------------------------------------------------------
| POST /api/auth/login
|--------------------------------------------------------------------------
*/

export const loginUser = async (
  req,
  res,
  next
) => {
  try {
    /*
    |--------------------------------------------------------------------------
    | Validate Request Body
    |--------------------------------------------------------------------------
    */

    const validatedData =
      loginSchema.parse(req.body);

    /*
    |--------------------------------------------------------------------------
    | Normalize Email
    |--------------------------------------------------------------------------
    */

    const normalizedEmail =
      validatedData.email
        .trim()
        .toLowerCase();

    /*
    |--------------------------------------------------------------------------
    | Find User
    |--------------------------------------------------------------------------
    */

    const user = await User.findOne({
      email: normalizedEmail,
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message:
          "Invalid email or password.",
      });
    }

    /*
    |--------------------------------------------------------------------------
    | Compare Password
    |--------------------------------------------------------------------------
    */

    const isPasswordCorrect =
      await bcrypt.compare(
        validatedData.password,
        user.password
      );

    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message:
          "Invalid email or password.",
      });
    }

    /*
    |--------------------------------------------------------------------------
    | Generate Token
    |--------------------------------------------------------------------------
    */

    const token = generateToken(
      user._id
    );

    /*
    |--------------------------------------------------------------------------
    | Success Response
    |--------------------------------------------------------------------------
    */

    return res.status(200).json({
      success: true,

      message:
        "Login successful.",

      token,

      user: sanitizeUser(user),
    });
  } catch (error) {
    /*
    |--------------------------------------------------------------------------
    | Validation Errors
    |--------------------------------------------------------------------------
    */

    if (error instanceof ZodError) {
      return res.status(400).json({
        success: false,
        message:
          error.errors?.[0]?.message ||
          "Invalid login credentials.",
      });
    }

    /*
    |--------------------------------------------------------------------------
    | Unexpected Errors
    |--------------------------------------------------------------------------
    */

    console.error(
      "Login error:",
      error
    );

    return next(error);
  }
};

/*
|--------------------------------------------------------------------------
| Get Current User
|--------------------------------------------------------------------------
| GET /api/auth/me
|--------------------------------------------------------------------------
*/

export const getCurrentUser = async (
  req,
  res,
  next
) => {
  try {
    const user = await User.findById(
      req.user.id
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message:
          "User not found.",
      });
    }

    return res.status(200).json({
      success: true,
      user: sanitizeUser(user),
    });
  } catch (error) {
    console.error(
      "Get current user error:",
      error
    );

    return next(error);
  }
};

/*
|--------------------------------------------------------------------------
| Get All Users
|--------------------------------------------------------------------------
| Used for:
| - assignee dropdowns
| - mentions
| - workspace invites
|--------------------------------------------------------------------------
*/

export const getAllUsers = async (
  req,
  res,
  next
) => {
  try {
    const users = await User.find({})
      .select(
        "name email avatar createdAt"
      )
      .lean();

    return res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    console.error(
      "Get users error:",
      error
    );

    return next(error);
  }
};