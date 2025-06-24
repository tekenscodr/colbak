const createError = require('http-errors')
const User = require('../models/user')
const { authSchema, loginSchema } = require('../helpers/validation_schema')
const {
    signAccessToken,
    signRefreshToken,
    verifyAccessToken
} = require('../helpers/jwt')
const bcrypt = require('bcryptjs')


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
forgotPassword: async(req,res,next) => {
try{
    const id = await req.params.id;
    const password = await req.body.password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)
const user = User.findOneAndUpdate(
            {_id: id},
            {password: hashedPassword},
            {new: true}
            )
            if(!user) throw createError(401, 'Could not update user');
            return res.status(200).json(user);         
} catch (error){
    return res.status(500).json(error)
}
}

login: async(req, res, next) => {
    try {
        const result = await loginSchema.validateAsync(req.body)
        const user = await User.findOne({ phoneNumber: result.phoneNumber })
        if (!user) throw createError.NotFound("User not registered")
        if (user.isDisabled === true) throw new Error('User is disabled')
        const isMatch = await user.isValidPassword(result.password)
        if (!isMatch)
            res.status(500).json("Please Enter the right password")

        const token = await signAccessToken(user.id);
            // const refreshToken = await signRefreshToken(customer.id)

            res.status(200).json({ token, ...user.toJSON(), status: 200 });
            // res.setHeader('Content-Type', 'application/json'); // This will cause the error

    } catch (error) {
        if (error.isJoi === true || error) {
            res.status(500).json(`${error}`)
        }
        res.status(500).json(`Phone Number or Password is not valid ${error}`)
        next(error)   
    }
},

//Set the router? 
getUser: async(req, res, next ) => {
    try {
        const person = await req.params.id
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
},

disableUser: async(req, res, next) => {
    try {
        const id = await req.params.id;
        const user = await User.findOneAndUpdate(
            {_id:id}, 
            {isDisabled:true},
            {new: true})
        if(!user)throw createError(401, 'Could not update');
        return res.status(200).json(user);
    } catch (error) {
        res.status(500).json(error)
        next();
    }
},
editUser:   async(req, res, next) => {
    try {
        const id = await req.params.id;
        const body = await req.body;
        const user = User.findOneAndUpdate(
            {_id: id},
            {body},
            {new: true}
            )
            if(!user) throw createError(401, 'Could not update user');
            return res.status(200).json(user); 
    } catch (error) {
        
    }
}
}
