const mongoose = require('mongoose')
const Schema = mongoose.Schema
const bcrypt = require('bcryptjs')
// const ticket =require('./qrcode-model')


const voteSchema = new Schema({
    agent: {
        type: String,
        required: true,
    },
    votes: [{
        name: {
            type: String ,
            required: true,
        },
        count: {
            type: Number,
            required: true,
        }
    }],  
},
{timestamp: true},
)

const Vote = mongoose.model('votes', voteSchema)
module.exports = Vote