const createError = require('http-errors')
const User = require('../models/user')
const { authSchema, loginSchema } = require('../helpers/validation_schema')
const {
    signAccessToken,
    signRefreshToken,
    verifyAccessToken
} = require('../helpers/jwt')

module.exports = {
register: async(req, res, next) => {
    try {
        const result = await authSchema.validateAsync(req.body)
        const doesExist = await User.findOne({ phoneNumber: result.phoneNumber })
        if (doesExist)
            return res.status(409).json({message: "already registered"})     
        const user = new User(result)
        const savedUser = await user.save()
        //const token = await signAccessToken(savedUser.id)
        //const refreshToken = await verifyAccessToken(savedUser.id)
        res.status(200).json(savedUser); 
    } catch (error) {
        if (error === true) error.status = 422;
        res.status(422).json({error: error.message})
        next(error)
    }
},

login: async(req, res, next) => {
    try {
        const result = await loginSchema.validateAsync(req.body)
        const user = await User.findOne({ phoneNumber: result.phoneNumber })
        if (!user) throw createError.NotFound("User not registered")
        
        //TODO: add if empty to api

        const isMatch = await user.isValidPassword(result.password)
        if (!isMatch)
            throw createError.Unauthorized("phoneNumber/password not valid");

        const token = await signAccessToken(user.id);
            // const refreshToken = await signRefreshToken(customer.id)

            res.status(200).json({ token, ...user.toJSON(), status: 200 });
            // res.setHeader('Content-Type', 'application/json'); // This will cause the error

    } catch (error) {
        if (error.isJoi === true)
            res.status(500).json("Invalid phoneNumber/Password " + `${error}`)
        next(error)   
    }
},

//Set the router? 
getUser: async(req, res, next ) => {
    try {
        const person = await req.body
        const resp = await User.findById({_id : person})
        return res.status(200).json({status:200, message: "success", resp})
    } catch (error) {
        next();
        return res.status(500).json({status:200, message: `User not found ${error}`})
    }
},

getAllUsers: async(req, res, next) =>{
    try {
        const users = await User.find().exec()
        return res.status(200).json({status:200, message: "success", users})
    } catch (error) {
        next();
        return res.status(500).json({status:200, message: `Error: ${error}`})
    }
}
}