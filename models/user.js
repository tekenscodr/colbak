const mongoose = require('mongoose')
const Schema = mongoose.Schema
const bcrypt = require('bcryptjs')
// const ticket =require('./qrcode-model')


const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        lowercase: true,
    },
    phoneNumber: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    firstname: {
        type: String,
        required: true,
    },
    surname: {
        type: String,
        required: true,
    },
    constituency: {
        type: String,
        required:true,
    },
    region: {
        type: String,
        required: true,
    },
    level: {
        type: String,
        required: true
    },
    isDisabled: {
        type: Boolean,
        default: false,
        required: true,
    }
})


userSchema.methods.toJSON = function(){
    const user = this.toObject()
    delete user.password;
    delete user.__v;
    return user;
}

userSchema.pre('save', async function(next) {
    try {
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(this.password, salt)
        this.password = hashedPassword
        next()
    } catch (error) {
        next(error)
    }
})

userSchema.methods.isValidPassword = async function(password) {
    try {
        return await bcrypt.compare(password, this.password)
    } catch (error) {
        throw error
    }
}

const User = mongoose.model('customer', userSchema)
module.exports = User