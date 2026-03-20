import express from 'express';
import {
  getAllFaculty,
  getFacultyById,
  createFaculty,
  updateFaculty,
  deleteFaculty,
} from '../controllers/facultyController.js';
import { verifyToken, isAdmin } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getAllFaculty);
router.get('/:id', getFacultyById);
router.post('/', verifyToken, isAdmin, createFaculty);
router.put('/:id', verifyToken, isAdmin, updateFaculty);
router.delete('/:id', verifyToken, isAdmin, deleteFaculty);

export default router;
