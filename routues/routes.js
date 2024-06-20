const express = require('express')

const router = express.Router()

const userController = require('../functions/fxn')

const authenticateToken = require('../middlewares/Authentication')

const { newUserValidation, loginValidation } = require('../validations/validateUser')


// Register new user
router.post('/register', newUserValidation, userController.registerUser)

// Login user
router.post('/login', loginValidation, userController.loginUser)

// Get all user
router.get('/Users', userController.getAllUsers)

// Fund wallet (requires authentication)
router.post('/fund', authenticateToken, userController.fundWallet)

// Debit wallet (requires authentication)
router.post('/debit', authenticateToken, userController.debitWallet)



module.exports = router

