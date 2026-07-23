import express from 'express';
import { regiterUser, loginUser } from '../Controllers/authController.mjs';

const router = express.Router();
/**
 * @swagger
 * /auth/register:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Register a new user
 *     description: Creates a new user account using the provided details. The email must be unique, and the password is securely hashed before being stored.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - firstname
 *               - email
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 example: arunkumar
 *               firstname:
 *                 type: string
 *                 example: Arun
 *               lastname:
 *                 type: string
 *                 example: Kumar
 *               email:
 *                 type: string
 *                 format: email
 *                 example: arun@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: Password@123
 *     responses:
 *       201:
 *         description: User registered successfully.
 *       400:
 *         description: Invalid input or validation failed.
 *       409:
 *         description: User already exists.
 *       500:
 *         description: Internal server error.
 */
router.post("/register",regiterUser);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Login user
 *     description: Authenticates the user using email and password, then returns a JWT access token.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: arun@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: Password@123
 *     responses:
 *       200:
 *         description: Login successful.
 *       400:
 *         description: Invalid request data.
 *       401:
 *         description: Invalid email or password.
 *       500:
 *         description: Internal server error.
 */

router.post("/login",loginUser);

export default router;