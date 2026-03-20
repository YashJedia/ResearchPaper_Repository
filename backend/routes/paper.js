import express from 'express';
import {
  getAllPapers,
  getPaperById,
  searchPapers,
  createPaper,
  updatePaper,
  deletePaper,
  getAnalytics,
} from '../controllers/paperController.js';
import { verifyToken, isAdmin } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getAllPapers);
router.get('/search', searchPapers);
router.get('/analytics', getAnalytics);
router.get('/:id', getPaperById);
router.post('/', verifyToken, isAdmin, createPaper);
router.put('/:id', verifyToken, isAdmin, updatePaper);
router.delete('/:id', verifyToken, isAdmin, deletePaper);

export default router;
