const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({

    fullName: { type: String },
   
    email: { type: String, required: true, unique: true},
    
    password: {type: String, required: true},

    phonenumber: {type: String},
    
    wallet: { type: Number, default: 0},

    transactions: [
        {
            type: { type: String, enum: ['debit', 'credit'], required: true },
            amount: { type: Number, required: true },
            timestamp: { type: Date, default: Date.now }
        }
    ],

    active: { type: Boolean, default: true},


}, {timestamps: true})

const user = new mongoose.model("user", userSchema)


module.exports = user