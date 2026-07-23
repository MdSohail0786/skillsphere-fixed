const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth');
const { getDashboard, getUsers, banUser, unbanUser, changeUserRole, deleteUser, getReports, resolveReport, verifyFreelancer, getAdminTransactions } = require('../controllers/adminController');

const admin = [authenticate, authorize('admin')];

router.get('/dashboard', ...admin, getDashboard);
router.get('/users', ...admin, getUsers);
router.patch('/users/:id/ban', ...admin, banUser);
router.patch('/users/:id/unban', ...admin, unbanUser);
router.patch('/users/:id/role', ...admin, changeUserRole);
router.delete('/users/:id', ...admin, deleteUser);
router.get('/reports', ...admin, getReports);
router.patch('/reports/:id', ...admin, resolveReport);
router.patch('/freelancers/:id/verify', ...admin, verifyFreelancer);
router.get('/transactions', ...admin, getAdminTransactions);

module.exports = router;
