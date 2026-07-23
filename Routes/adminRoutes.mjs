import express from 'express';
import { authMiddleware } from '../Middlewares/authMiddleware.mjs';
import { roleMiddleware } from '../Middlewares/roleMiddleware.mjs';
import { adminDashboard, changeRoleByID, deleteUserByID, deleteUserByMail, getAllUsers, visitUserProfileByID } from '../Controllers/adminController.mjs';
import { idValidator } from '../Middlewares/idValidation.mjs';
import { changePassword, deleteAccount, getProfile, updateProfile } from '../Controllers/userController.mjs';


const router = express.Router();

//Own Account
/**
 * @swagger
 * /admin/profile:
 *   get:
 *     tags:
 *       - Admin
 *     summary: Get authenticated admin profile
 *     description: Retrieves the profile information of the authenticated administrator.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Admin profile retrieved successfully.
 *       401:
 *         description: Unauthorized. Invalid or missing JWT token.
 *       403:
 *         description: Access denied. Admin privileges required.
 *       404:
 *         description: Admin not found.
 *       500:
 *         description: Internal server error.
 */
router.get('/profile',authMiddleware, roleMiddleware("admin"),getProfile);


/**
 * @swagger
 * /admin/profile:
 *   patch:
 *     tags:
 *       - Admin
 *     summary: Update authenticated admin profile
 *     description: Updates the username, firstname, lastname or email of the authenticated administrator.
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
 *                 example: admin01
 *               firstname:
 *                 type: string
 *                 example: Arun
 *               lastname:
 *                 type: string
 *                 example: Kumar
 *               email:
 *                 type: string
 *                 format: email
 *                 example: admin@example.com
 *     responses:
 *       200:
 *         description: Admin profile updated successfully.
 *       400:
 *         description: Invalid request data or validation failed.
 *       401:
 *         description: Unauthorized. Invalid or missing JWT token.
 *       403:
 *         description: Access denied. Admin privileges required.
 *       409:
 *         description: Username or email already exists.
 *       500:
 *         description: Internal server error.
 */
router.patch('/profile',authMiddleware,roleMiddleware("admin"),updateProfile);

/**
 * @swagger
 * /admin/profile/password:
 *   patch:
 *     tags:
 *       - Admin
 *     summary: Change authenticated admin password
 *     description: Changes the password of the authenticated administrator after verifying the current password.
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
 *                 example: Admin@123
 *               password:
 *                 type: string
 *                 format: password
 *                 example: NewAdmin@123
 *     responses:
 *       200:
 *         description: Password changed successfully.
 *       400:
 *         description: Invalid request data or current password is incorrect.
 *       401:
 *         description: Unauthorized. Invalid or missing JWT token.
 *       403:
 *         description: Access denied. Admin privileges required.
 *       500:
 *         description: Internal server error.
 */
router.patch('/profile/password',authMiddleware,roleMiddleware("admin"),changePassword);

/**
 * @swagger
 * /admin/profile:
 *   delete:
 *     tags:
 *       - Admin
 *     summary: Delete authenticated admin account
 *     description: Permanently deletes the authenticated administrator's account.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Admin account deleted successfully.
 *       401:
 *         description: Unauthorized. Invalid or missing JWT token.
 *       403:
 *         description: Access denied or administrators cannot delete another administrator.
 *       404:
 *         description: Admin account not found.
 *       500:
 *         description: Internal server error.
 */
router.delete('/profile',authMiddleware,roleMiddleware("admin"),deleteAccount);


//User Accounts


/**
 * @swagger
 * /admin/dashboard:
 *   get:
 *     tags:
 *       - Admin
 *     summary: Get admin dashboard statistics
 *     description: Retrieves dashboard statistics including the total number of users, total administrators, and total regular users.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard statistics retrieved successfully.
 *       401:
 *         description: Unauthorized. Invalid or missing JWT token.
 *       403:
 *         description: Access denied or administrators cannot delete another administrator.
 *       500:
 *         description: Internal server error.
 */
router.get('/dashboard',authMiddleware,roleMiddleware("admin"), adminDashboard);

/**
 * @swagger
 * /admin/users:
 *   get:
 *     tags:
 *       - Admin
 *     summary: Get all users
 *     description: Retrieves a list of all registered users. This endpoint is accessible only to authenticated administrators.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Users retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     example: 689b6c5a1234567890abcdef
 *                   username:
 *                     type: string
 *                     example: arunkumar
 *                   email:
 *                     type: string
 *                     format: email
 *                     example: arun@example.com
 *                   role:
 *                     type: string
 *                     enum:
 *                       - user
 *                       - admin
 *                     example: user
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                     example: "2026-07-22T10:30:00.000Z"
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *                     example: "2026-07-22T10:45:00.000Z"
 *       401:
 *         description: Unauthorized. Invalid or missing JWT token.
 *       403:
 *         description: Access denied. Admin privileges required.
 *       500:
 *         description: Internal server error.
 */
router.get('/users',authMiddleware,roleMiddleware("admin"),getAllUsers);

/**
 * @swagger
 * /admin/users/{id}:
 *   get:
 *     tags:
 *       - Admin
 *     summary: Get user by ID
 *     description: Retrieves the profile information of a specific user using their unique ID. This endpoint is accessible only to authenticated administrators.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: MongoDB ObjectId of the user.
 *         schema:
 *           type: string
 *           example: 689b6c5a1234567890abcdef
 *     responses:
 *       200:
 *         description: User retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   example: 689b6c5a1234567890abcdef
 *                 username:
 *                   type: string
 *                   example: arunkumar
 *                 firstname:
 *                   type: string
 *                   example: Arun
 *                 lastname:
 *                   type: string
 *                   example: Kumar
 *                 email:
 *                   type: string
 *                   format: email
 *                   example: arun@example.com
 *                 role:
 *                   type: string
 *                   enum:
 *                     - user
 *                     - admin
 *                   example: user
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2026-07-22T10:30:00.000Z"
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2026-07-22T10:45:00.000Z"
 *       400:
 *         description: Invalid user ID.
 *       401:
 *         description: Unauthorized. Invalid or missing JWT token.
 *       403:
 *         description: Access denied. Admin privileges required.
 *       404:
 *         description: User not found.
 *       500:
 *         description: Internal server error.
 */
router.get('/users/:id',authMiddleware,roleMiddleware("admin"),idValidator,visitUserProfileByID);

/**
 * @swagger
 * /admin/users:
 *   delete:
 *     tags:
 *       - Admin
 *     summary: Delete user by email
 *     description: Deletes a user account using the provided email address. This endpoint is accessible only to authenticated administrators.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: arun@example.com
 *     responses:
 *       200:
 *         description: User deleted successfully.
 *       400:
 *         description: Invalid email or request data.
 *       401:
 *         description: Unauthorized. Invalid or missing JWT token.
 *       403:
 *         description: Access denied. Admin privileges required.
 *       404:
 *         description: User not found.
 *       500:
 *         description: Internal server error.
 */
 
router.delete('/users', authMiddleware,roleMiddleware("admin"),deleteUserByMail);

/**
 * @swagger
 * /admin/users/{id}:
 *   delete:
 *     tags:
 *       - Admin
 *     summary: Delete user by ID
 *     description: Deletes a user account using the user's unique ID. This endpoint is accessible only to authenticated administrators.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: MongoDB ObjectId of the user.
 *         schema:
 *           type: string
 *           example: 689b6c5a1234567890abcdef
 *     responses:
 *       200:
 *         description: User deleted successfully.
 *       400:
 *         description: Invalid user ID.
 *       401:
 *         description: Unauthorized. Invalid or missing JWT token.
 *       403:
 *         description: Access denied. Admin privileges required or operation not allowed.
 *       404:
 *         description: User not found.
 *       500:
 *         description: Internal server error.
 */
router.delete('/users/:id', authMiddleware,roleMiddleware("admin"),idValidator,deleteUserByID);

/**
 * @swagger
 * /admin/users/{id}:
 *   patch:
 *     tags:
 *       - Admin
 *     summary: Change user role by ID
 *     description: Updates the role of a specific user using their unique ID. This endpoint is accessible only to authenticated administrators.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: MongoDB ObjectId of the user.
 *         schema:
 *           type: string
 *           example: 689b6c5a1234567890abcdef
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - role
 *             properties:
 *               role:
 *                 type: string
 *                 enum:
 *                   - user
 *                   - admin
 *                 example: admin
 *     responses:
 *       200:
 *         description: User role updated successfully.
 *       400:
 *         description: Invalid user ID or invalid role.
 *       401:
 *         description: Unauthorized. Invalid or missing JWT token.
 *       403:
 *         description: Access denied. Admin privileges required.
 *       404:
 *         description: User not found.
 *       500:
 *         description: Internal server error.
 */
router.patch('/users/:id',authMiddleware,roleMiddleware("admin"),idValidator,changeRoleByID)

export default router;