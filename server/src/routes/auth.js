import express from "express";

import {
  registerUser,
  loginUser,
  getAllUsers,
  getCurrentUser,
} from "../controllers/authController.js";

import authMiddleware from "../middleware/auth.js";

const router = express.Router();

/*
|--------------------------------------------------------------------------
| Auth Routes
|--------------------------------------------------------------------------
| Handles:
| - registration
| - login
| - authenticated user retrieval
|--------------------------------------------------------------------------
*/

/*
|--------------------------------------------------------------------------
| Register User
|--------------------------------------------------------------------------
| POST /api/auth/register
|--------------------------------------------------------------------------
*/

router.post(
  "/register",
  async (req, res, next) => {
    try {
      return await registerUser(
        req,
        res
      );
    } catch (error) {
      next(error);
    }
  }
);

/*
|--------------------------------------------------------------------------
| Login User
|--------------------------------------------------------------------------
| POST /api/auth/login
|--------------------------------------------------------------------------
*/

router.post(
  "/login",
  async (req, res, next) => {
    try {
      return await loginUser(
        req,
        res
      );
    } catch (error) {
      next(error);
    }
  }
);

/*
|--------------------------------------------------------------------------
| Get Current Authenticated User
|--------------------------------------------------------------------------
| GET /api/auth/me
|--------------------------------------------------------------------------
*/

router.get(
  "/me",
  authMiddleware,
  async (req, res, next) => {
    try {
      /*
      |--------------------------------------------------------------------------
      | Prefer controller if available
      |--------------------------------------------------------------------------
      */

      if (getCurrentUser) {
        return await getCurrentUser(
          req,
          res
        );
      }

      /*
      |--------------------------------------------------------------------------
      | Safe fallback
      |--------------------------------------------------------------------------
      */

      return res.status(200).json({
        success: true,
        user: req.user,
      });
    } catch (error) {
      next(error);
    }
  }
);

/*
|--------------------------------------------------------------------------
| Get All Users
|--------------------------------------------------------------------------
| Protected route used for:
| - assignee dropdowns
| - mentions
| - workspace member discovery
|--------------------------------------------------------------------------
*/

router.get(
  "/users",
  authMiddleware,
  async (req, res, next) => {
    try {
      return await getAllUsers(
        req,
        res
      );
    } catch (error) {
      next(error);
    }
  }
);

export default router;