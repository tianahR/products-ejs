const mongoose = require('mongoose')

const bcrypt = require('bcryptjs')

const jwt = require('jsonwebtoken')




//createSchema
//use match to see if the email provided matches the valid expression
const UserSchema = new mongoose.Schema({
    name: {
      type: String,
      required: [true, 'Please provide name'],
      maxlength: 50,
      minlength: 3,
    },
    email: {
      type: String,
      required: [true, 'Please provide email'],
      match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        'Please provide a valid email',
      ],
      unique: true, //unique create unique index
    },
    password: {
      type: String,
      required: [true, 'Please provide password'],
      minlength: 6,
    },
  })

 

UserSchema.pre('save',async function(){
const salt = await bcrypt.genSalt(10) // random bytes
this.password = await bcrypt.hash(this.password,salt)

 })


UserSchema.methods.createJWT = function () {

  return jwt.sign(
    { userId: this._id, 
      name: this.name 
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_LIFETIME,
    }
  )
}


UserSchema.methods.comparePassword = async function (passwordToCompare) {
  const isMatch = await bcrypt.compare(passwordToCompare, this.password)
  return isMatch
}
  
module.exports = mongoose.model('User', UserSchema)