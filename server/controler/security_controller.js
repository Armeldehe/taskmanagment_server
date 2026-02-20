const security_service = require('../services/securityservice')
const jwt = require('jsonwebtoken')

const register = async (req, res) => {
    const body = req.body
    const result = await security_service.register(body)
    console.log(result)
    res.status(result.status).json({...result})
}
const login = async (req, res) => {
    const {email, password} = req.body;
    const result = await security_service.login({email, password});

    if (result.data && result.status == 200) {
        const {accessToken, refreshToken} = result.data;
        return res.cookie('refreshToken', refreshToken)
        .header('Authorization', accessToken)
        .status(result.status)
        .json({...result});
    }
    return res.status(result.status).send({message:result.message})
}

const logout = (request, response) => {
    const SECRET = 'qqefkuhio3k2rjkofn2mbikbkwjhnkk'
    const accessToken = jwt.sign({userId: request.user}, SECRET, {expiresIn: 1});
    const refreshToken = jwt.sign({userId: request.user}, SECRET, {expiresIn: 1});
    return response.cookie('refreshToken', refreshToken, { httpOnly: true, sameSite: 'strict' })
    .header('Authorization', "")
    .json({message: 'vous êtes déconnectés', data: {accessToken, refreshToken} });
}

const activation = async (request, response) => {
    const {token, userId } = await request.body
    const result = await security_service.Activation({token, userId });
    return response.json(result)
}


module.exports = {register, login, logout, activation}