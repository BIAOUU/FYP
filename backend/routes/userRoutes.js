
const express = require('express')
const requireAuth = require('../middleware/requireAuth')
// controller functions
const { loginUser, signupUser, updateUserProfile, getAllUsers, getUserDetails,
    suspendUser, getUserAgeDistribution, sendVerificationCode, resetPassword } = require('../controllers/userControllers');

const router = express.Router()

// login route
router.post('/login', loginUser)

// signup route
router.post('/signup', signupUser)

// Use to update user profile
router.put('/profile', requireAuth, updateUserProfile);

// Route to get all users, protected by authentication middleware
router.get('/admin/users', requireAuth, getAllUsers);

router.get('/users/:userId', requireAuth, getUserDetails);

router.put('/suspend/:userId', requireAuth, suspendUser);

router.get('/age-distribution', getUserAgeDistribution);

router.post('/send-code', sendVerificationCode);

router.post('/reset-password', resetPassword);



module.exports = router