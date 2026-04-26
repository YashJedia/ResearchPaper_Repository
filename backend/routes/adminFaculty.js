import express from 'express';
import {
  getPendingRegistrations,
  getAllFacultyRegistrations,
  approveFacultyRegistration,
  rejectFacultyRegistration,
} from '../controllers/adminFacultyController.js';
import { verifyToken, isAdmin } from '../middleware/auth.js';

const router = express.Router();

// All routes require admin authentication
router.use(verifyToken, isAdmin);

// Get pending faculty registrations
router.get('/registrations/pending', getPendingRegistrations);

// Get all faculty registrations
router.get('/registrations', getAllFacultyRegistrations);

// Approve faculty registration
router.put('/registrations/:id/approve', approveFacultyRegistration);

// Reject faculty registration
router.put('/registrations/:id/reject', rejectFacultyRegistration);

export default router;
