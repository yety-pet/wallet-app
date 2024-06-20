const bcrypt = require('bcrypt')

const jwt = require('jsonwebtoken')

const User = require('../models/User')

const JWT_SECRET = process.env.JWT_SECRET

// Register a new user
exports.registerUser = async (req, res) => {
    const { username, fullName, email, password, phonenumber } = req.body

    try {
        // Check if user already exists
        let user = await User.findOne({ email })

        if (user) {
            return res.status(400).json({
                 message: 'User account already exists' })
        }

        // Hash password
    
        const hashedPassword = await bcrypt.hash(password, 12)

        // Create new user
        user = new User({
            fullName,
            username,
            email,
            password: hashedPassword,
            phonenumber
        });

        await user.save()

        // Generate JWT token
        const payload = {
            user: {
                id: user.id
            }
        };

        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' })
           
            return res.status(200).json({
                 message: "Registration Succeful", token })
        
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Server Error' })
    }

}

// Get all Users in the Database

exports.getAllUsers = async(req, res)=>{

    try {

    const users = await User.find()

    return res.status(200).json({
        message: "Successful List of Users",
        count: users.length,
        users
    })

} catch (error) {
    console.error(error.message)
    res.status(500).json({ message: 'Server Error' })
}

}

// Login user
exports.loginUser = async (req, res) => {
    const { email, password } = req.body

    try {
        // Check if user exists
        let user = await User.findOne({ email })

        if (!user) {
            return res.status(400).json({ message: 'Invalid Credentials' })
        }

        // Validate password
        const isMatch = await bcrypt.compare(password, user.password)

        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid Credentials' })
        }

        // Generate JWT token
        const payload = {
            user: {
                id: user.id
            }
        };

        const accessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' })
        res.status(200).json({ 
            message: "Login Successful", accessToken, user })
        
    } catch (error) {
        console.error(error.message)
        res.status(500).json({ message: 'Server Error' })
    }
};

// Fund wallet (requires authentication)
exports.fundWallet = async (req, res) => {

    const { amount } = req.body

    const userId = req.user.user.id

    try {
        // Find user by userId
        let user = await User.findById(userId)

        if (!user) {
            return res.status(404).json({ message: 'User not found' })
        }

        // Update user's wallet balance
        user.wallet += amount

        // Add transaction record
        user.transactions.push({
            type: 'credit',
            amount: amount
        });

        await user.save()

        return res.status(200).json({
            message: 'Wallet funded successfully',
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                wallet: user.wallet
            }
        })

    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Server Error' })
    }
}

// Debit wallet (requires authentication)
exports.debitWallet = async (req, res) => {

    const { amount } = req.body

    const userId = req.user.user.id

    try {
        // Find user by userId
        let user = await User.findById(userId)

        if (!user) {
            return res.status(404).json({ message: 'User not found' })
        }

        // Check if user has sufficient balance
        if (user.wallet < amount) {
            return res.status(400).json({ message: 'Insufficient balance' })
        }

        // Update user's wallet balance
        user.wallet -= amount

        // Add transaction record
        user.transactions.push({
            type: 'debit',
            amount: amount
        })

        await user.save()

        return res.status(200).json({
            message: 'Wallet debited successfully',
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                wallet: user.wallet
            }
        })

    } catch (error) {
        console.error(error.message)
        res.status(500).json({ message: 'Server Error' })
    }
}
