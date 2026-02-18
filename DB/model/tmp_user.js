const mongoose = require('mongoose')
const validator = require('validator')
const crypter_password = require('../../utils/hash_password')
const genToken = require('../../utils/gentoken')

const tmpUserShema = new mongoose.Schema({
    name :{
        type: String,
        required: true, 
        trim: true
    },
    email :{
        type: String,
        required:true,
        unique: true,
        trim: true,
        lowercase: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('email is invalid')
            }
        }
    },
    password:{
        type: String,
        required:true,
        minlength: 8
    },
    isActive:{
        type: Boolean,
        required: true,
        default: true
    },
    avatar:{
        type: String,
    },
    token : {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: '600s'
    }

})

tmpUserShema.pre("save", async function() {
    if(this.isNew){
        this.password = await crypter_password(this.password)
        this.token = await genToken()
    }
})



const tmpUser = mongoose.model('tmpUser', tmpUserShema)
module.exports = tmpUser 