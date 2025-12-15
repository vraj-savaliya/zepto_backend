require('dotenv').config()
const express = require('express')
const fs = require('fs')
const path = require('path')
const cors = require('cors')
const app = express()
const mongoose = require('mongoose')

const options = {
    origin: ['http://localhost:3000', 'http://localhost:3001','https://zepto-frotend.vercel.app']
}

app.use(cors(options))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, 'assets')))

const category = require('./routes/Categoryroutes')
app.use(category)

const user = require('./routes/Usersideroutes')
app.use(user)

app.use((err, req, res, next) => {
    return res.status(err.code).json({
        success: false,
        code: err.code,
        message: err.message
    })
})

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("Database Connected!");

        app.listen(4000, () => {
            console.log("Server was running 4000")
        })
    }).catch((error) => {
        console.log(error.message)
    })
