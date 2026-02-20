const userModel = require("../DB/model/user");
const userRepo = require("../DB/repository/user.repo");
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')


const register = async (userData) => {
  const { email } = userData;
  const users = await userModel.find({ email });
  console.log(users)
  if (!!users.length) {
    return { status: 422, message: "ce compte est deja existant", data: null };
  }
  try {
    const result = await userRepo.createUser(userData);
    return { status: 200, message: "compte crée avec succes", data: result };
  } catch (error) {
    return { status: 500, message: error.message, data: null };
    
  }
};

const login = async ({email, password}) => {
    const secret = process.env.SECRET
    const expiresIn = process.env.EXPIRES_IN
    const user = await userRepo.findOne({email})
    if(!user){
        return { status: 401, message: "email introuvable", data: null };
    }
    const isPasswordValid =  await bcrypt.compare(password, user.password)
    if(!isPasswordValid){
        return { status: 401, message: "password invalid", data: null };
    }
    try {
        const accessToken = jwt.sign({userId: user._id}, secret, {expiresIn})
        const refreshToken = jwt.sign({userId: user._id}, secret, {expiresIn: '7d'})
        const {password, isActive, __V, ...rest} = user.toJSON()
        return { status: 200, message: "connection succesfull", data: {user: rest, accessToken, refreshToken} };
    } catch (error) {
        return { status: 500, message: error.message, data: null };
    }
}


module.exports = { register, login };
