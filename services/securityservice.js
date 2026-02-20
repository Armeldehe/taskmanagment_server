const userModel = require("../DB/model/user");
const userRepo = require("../DB/repository/user.repo");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const tmpUser = require("../DB/model/tmp_user");
const sendmail = require("../utils/sendmail")

// const register = async (userData) => {
//   const { email } = userData;
//   const users = await userModel.find({ email });
//   console.log(users)
//   if (!!users.length) {
//     return { status: 422, message: "ce compte est deja existant", data: null };
//   }
//   try {
//     const result = await userRepo.createUser(userData);
//     return { status: 200, message: "compte crée avec succes", data: result };
//   } catch (error) {
//     return { status: 500, message: error.message, data: null };

//   }
// };

const register = async (userData) => {
  const { email } = userData;
  const users = await userModel.find({ email });
  console.log(users);
  if (!!users.length) {
    return { status: 422, message: "ce compte est deja existant", data: null };
  }

  const existingTmpUser = await tmpUser.findOne({ email });
  if (existingTmpUser) {
    return {
      status: 422,
      message: "un email de verification a deja été envoyé à cet adresse",
      data: null,
    };
  }

  try {
    const user = await new tmpUser(userData).save();
    const link = `${process.env.URL_PROTOCOL}://${process.env.CLIENT_URL}/#${process.env.ACTIVATION_PATH}?token=${user.token}&id=${user._id}`;
    console.log("link", link)
    const mailResult = await sendmail(user.email, "verification d'email", {name:user.name, link}, "./templates/verifyEmail.handlebars" )
    console.log("mail envoyer", mailResult)
    return { status: 200, message: "email envoyer", data: "ok" };
  } catch (error) {
    return { status: 500, message: error.message, data: null };
  }
};

const login = async ({ email, password }) => {
  const secret = process.env.SECRET;
  const expiresIn = process.env.EXPIRES_IN;
  const user = await userRepo.findOne({ email });
  if (!user) {
    return { status: 401, message: "email introuvable", data: null };
  }
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return { status: 401, message: "password invalid", data: null };
  }
  try {
    const accessToken = jwt.sign({ userId: user._id }, secret, { expiresIn });
    const refreshToken = jwt.sign({ userId: user._id }, secret, {
      expiresIn: "7d",
    });
    const { password, isActive, __V, ...rest } = user.toJSON();
    return {
      status: 200,
      message: "connection succesfull",
      data: { user: rest, accessToken, refreshToken },
    };
  } catch (error) {
    return { status: 500, message: error.message, data: null };
  }
};

const Activation = async (payload) => {

  const { token, userId } = payload;
  
  const user = await tmpUser.findById(userId);

  if (!user) {
      return { status: 200, isOk: false, message: "Désolé votre token d'activation a expiré, vous pouvez reprendre le processus de creation de compte. merci.", data: null  }
  }

  if (user.token !== token) {
      return { status: 200, isOk: false, message: "Désolé votre token est invalide", data: null }
  }

  try {
      const {__v, _id, otp, createdAt, token, ...rest} = user.toJSON()

      const existingUser = await userRepo.findOne({_id: rest._id});

      if (!existingUser) {

        const newUser = await userRepo.createUser({...rest, is_active: true})

        return { status: 200, isOk: true, message: "Votre compte a été activé avec succès. vous pouvez vous connecter à présent",  data: newUser }
        
      } else {
        return { status: 200, isOk: false, message: "Le compte utilisateur est déjà existant et activé.",  data: existingUser }
      }
      
  } catch (error) {
      return { status: 401, isOk: false, message: error.message,  data: null }
  }

}

module.exports = { register, login, Activation };
