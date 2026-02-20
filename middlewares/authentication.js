const jwt = require('jsonwebtoken')

const secret = process.env.SECRET

const authenticate = (req, res, next) => {
    const accessToken = req.headers["authorization"]
    console.log('accesstoken: ', accessToken)
    if(!accessToken){
        return res.status(401).json("access refusé, pas de token fourni")
    }
    try {
        const decoded = jwt.verify(accessToken, secret);
        req.user = decoded.userId
        next()
    } catch (error) {
        res.status(400).json("token invalid")
    }
}

module.exports = authenticate