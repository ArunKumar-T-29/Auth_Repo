import express from 'express';
import { authMiddleware } from '../Middlewares/authMiddleware.mjs';
import {changePassword,deleteAccount,getProfile,updateProfile} from '../Controllers/userController.mjs';
import { roleMiddleware } from '../Middlewares/roleMiddleware.mjs';

const router = express.Router();

/**
 * @swagger
 * /user/profile:
 *   get:
 *     tags:
 *       - User
 *     summary: Get authenticated user's profile
 *     description: Retrieves the profile information of the authenticated user.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile retrieved successfully.
 *       401:
 *         description: Unauthorized. Invalid or missing JWT token.
 *       403:
 *         description: Access denied. This endpoint is accessible only to users with the "user" role.
 *       404:
 *         description: User not found.
 *       500:
 *         description: Internal server error.
 */
router.get('/profile', authMiddleware,roleMiddleware("user"), getProfile);

/**
 * @swagger
 * /user/profile:
 *   patch:
 *     tags:
 *       - User
 *     summary: Update authenticated user's profile
 *     description: Updates one or more profile fields (username, firstname, lastname or email).
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
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
 *     responses:
 *       200:
 *         description: Profile updated successfully.
 *       400:
 *         description: Invalid request data.
 *       401:
 *         description: Unauthorized. Invalid or missing JWT token.
 *       403:
 *         description: Access denied. This endpoint is accessible only to users with the "user" role.
 *       409:
 *         description: Username or email already exists.
 *       500:
 *         description: Internal server error.
 */
router.patch('/profile', authMiddleware,roleMiddleware("user"), updateProfile);

/**
 * @swagger
 * /user/profile:
 *   delete:
 *     tags:
 *       - User
 *     summary: Delete authenticated user's account
 *     description: Permanently deletes the authenticated user's account. This endpoint is accessible only to users with the "user" role.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *           description: Account deleted successfully.
 *       401:
 *           description: Unauthorized. Invalid or missing JWT token.
 *       403:
 *           description: Access denied. This endpoint is accessible only to users with the "user" role.
 *       404:
 *           description: User not found.
 *       500:
 *           description: Internal server error.
 */
router.delete('/profile', authMiddleware,roleMiddleware("user"), deleteAccount);


/**
 * @swagger
 * /user/profile/password:
 *   patch:
 *     tags:
 *       - User
 *     summary: Change authenticated user's password
 *     description: Changes the password of the authenticated user after verifying the current password. This endpoint is accessible only to users with the "user" role.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - currentpassword
 *               - password
 *             properties:
 *               currentpassword:
 *                 type: string
 *                 format: password
 *                 example: OldPassword@123
 *               password:
 *                 type: string
 *                 format: password
 *                 example: NewPassword@123
 *     responses:
 *       200:
 *         description: Password changed successfully.
 *       400:
 *         description: Invalid request data or current password is incorrect.
 *       401:
 *         description: Unauthorized. Invalid or missing JWT token.
 *       403:
 *         description: Access denied. This endpoint is accessible only to users with the "user" role.
 *       500:
 *         description: Internal server error.
 */
router.patch('/profile/password', authMiddleware,roleMiddleware("user"), changePassword);

export default router;