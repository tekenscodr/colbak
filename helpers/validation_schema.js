const Joi = require('joi')


// function generateAccountNumber() {
//     let num = ''
//     while (num.length < 10) {
//       num += Math.floor(Math.random() * 10)
//     }
//     return num
// }

// numberCreated = generateAccountNumber()


const authSchema = Joi.object({
    phoneNumber: Joi.number().min(10).required(),
    password: Joi.string().min(6).required(),
    firstname: Joi.string().required(),
    surname: Joi.string().required(),
    constituency: Joi.string().required(),
    region: Joi.string().required(),
    email: Joi.string().email().lowercase().required(),
    level: Joi.string().required(),

})

const loginSchema = Joi.object({
    phoneNumber: Joi.number().min(10).required(),
    password: Joi.string().min(6).required()
})

module.exports = {
    authSchema,
    loginSchema,
}