const jwt = require('jsonwebtoken')
const {AuthenticationError} = require('apollo-server')

const {SECRET_KEY} = require('./config')

module.exports.validateRegisterInput = function(username, password, confirmPassword, email){
    const errors = {}

    if(!username.trim()) errors.username = 'Username is empty'

    if(!email.trim()) errors.email = 'Email is empty'
    else {
        const regex = /^(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/
        
        if(!email.match(regex)) errors.email = 'Invalid email format'
    }

    if(!password.trim()) errors.password = 'Password is empty'
    else if (password !== confirmPassword) errors.password = 'Passwords do not match'

    return {
        errors,
        valid : Object.keys(errors).length < 1
    }

}

module.exports.validateLoginInput = function(username, password){
    const errors = {}

    if(!username.trim()) errors.username = 'Username is empty'

    if(!password.trim()) errors.password = 'Password is empty'

    return {
        errors,
        valid : Object.keys(errors).length < 1
    }
}

module.exports.generateToken = function(user){

    return jwt.sign({
        id : user.id,
        email : user.email,
        username : user.username
    }, SECRET_KEY, {expiresIn : '1h'})

}

module.exports.verifyAuth = function(context){
    const header = context.req.headers.authorization
    if(header){
        const token = header.split('Bearer ')[1]
        if(token) {
            try{
                const user = jwt.verify(token, SECRET_KEY)
                return user
            }
            catch(err){
                throw new AuthenticationError('Invalid/Expired Token')
            }
        }
        else throw new AuthenticationError('Invalid Token Format')
    }
    else throw new AuthenticationError('No Authentication Header Provided')
}