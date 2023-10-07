const express = require('express')
const morgan = require('morgan')
const createError = require('http-errors')
const User = require('./models/user')
require('./helpers/init_mongo')
const AuthRoute = require('./routes/auth')
const mongoose = require('mongoose')
const cors = require('cors');
require('dotenv').config();
const app = express()
const port = process.env.PORT || 3000
//middleware
app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
// app.use('/uploads/', express.static('uploads'))


//if you want in every domain then
app.use(cors())

//Routes from server
app.get('/', (req, res)=>{
    res.send("You are in the server"); 
})

app.use('/auth', AuthRoute)

app.use(async(req, res, next) => {
    next(createError.NotFound())
})

app.use((err, req, res, next) => {
    res.status(err.status || 500).json({
        error: {
            status: err.status || 500,
            message: err.message,
        },
    })
})


const PORT =  2024

app.listen(PORT, () => {
    console.log(`listening on port ${PORT} http://localhost:${PORT}`);
})

module.exports = app


// const corsOption = {
//     origin: ['https://tekensapp.vercel.app/'],
// };
//  app.use(cors(corsOption));