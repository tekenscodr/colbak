const mongoose = require('mongoose')
const Schema = mongoose.Schema
const bcrypt = require('bcryptjs')


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
    image: {
        type: String,
        // required: true,
    } 
},
{timestamp: true},
)

const Vote = mongoose.model('votes', voteSchema)
module.exports = Vote