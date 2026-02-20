const mongoose = require('mongoose')
const validator = require('validator')
const crypter_password = require('../../utils/hash_password')

const userShema = new mongoose.Schema({
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
    }

})

// userShema.pre("save", async function() {
//     if(this.isNew){
//         this.password = await crypter_password(this.password)
//     }
// })
const User = mongoose.model('User', userShema)
module.exports = User