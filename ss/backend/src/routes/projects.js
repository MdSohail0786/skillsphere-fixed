const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const { uploadSingle, uploadMultiple } = require('../config/cloudinary');
const { getMyProjects, getProjectById, submitMilestone, approveMilestone, uploadProjectFile, getClientStats } = require('../controllers/projectController');

router.get('/', authenticate, getMyProjects);
router.get('/stats', authenticate, getClientStats);
router.get('/:id', authenticate, getProjectById);
router.patch('/:id/milestone/:milestoneId/submit', authenticate, uploadMultiple('deliverables', 'deliverables', 10), submitMilestone);
router.patch('/:id/milestone/:milestoneId/approve', authenticate, approveMilestone);
router.post('/:id/files', authenticate, uploadSingle('project-files', 'file'), uploadProjectFile);

module.exports = router;
