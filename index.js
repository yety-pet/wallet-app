const express = require("express")

const mongoose = require("mongoose")

const dotenv = require("dotenv").config()



const cors = require("cors")

const JWT_SECRET = process.env.JWT_SECRET

const MONGODB = process.env.db 


const app = express()

const PORT = process.env.PORT || 3000;


app.listen(PORT, ()=>{
    console.log(`Server is running on ${PORT}`) })

mongoose.connect(MONGODB)
.then(() => {
    console.log('Connected to MongoDB')
})

app.use(express.json())

app.use(cors())


// Routes
const Routes = require('./routues/routes')
app.use('/api', Routes)

app.use((req, res)=>{
    res.status(404).json({
        message: "Sorry this endpoint does not exist."
    })
})
