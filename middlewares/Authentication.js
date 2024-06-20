
const jwt = require("jsonwebtoken")

const user = require("../models/User")

const JWT_SECRET = process.env.JWT_SECRET;

// Middleware to authenticate JWT token

const authenticateToken = async (req, res, next) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (!token) {
        return res.status(401).json({ message: 'Access Denied' })
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            console.error(err.message);
            return res.status(403).json({ message: 'Unthorised User' })
        }
        req.user = user;
        next();
    });
}

module.exports = authenticateToken