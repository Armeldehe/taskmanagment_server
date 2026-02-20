const bcrypt = require('bcryptjs')


const crypter_password = async (password) => {
    const hashed_password = await bcrypt.hash(password, Number(10))
    return hashed_password
}

module.exports = crypter_password