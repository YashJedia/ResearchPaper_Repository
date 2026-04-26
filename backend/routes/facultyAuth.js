import express from 'express';
import {
  registerFaculty,
  loginFaculty,
  getFacultyProfile,
  updateFacultyProfile,
  getFacultyPapers,
} from '../controllers/facultyAuthController.js';
import { verifyFacultyToken, isOwnProfile } from '../middleware/facultyAuth.js';

const router = express.Router();

// Public Routes
router.post('/register', registerFaculty);
router.post('/login', loginFaculty);

// Protected Routes (Faculty only)
router.get('/profile', verifyFacultyToken, getFacultyProfile);
router.put('/profile', verifyFacultyToken, updateFacultyProfile);
router.get('/my-papers', verifyFacultyToken, getFacultyPapers);

export default router;
