const {User} = require("../model")



const createUser = async (data) => {
    try {
        const user = new User(data)
        const result = await user.save()
        return result 
    } catch (error) {
        console.error("Error on User creation: ",error)
    }
}

const getUser = async (Userid) => {
    try {
        const result = await User.findById(Userid)
        return result 
    } catch (error) {
        console.error("User find error: ",error)
    }
}

const findOne = async (query) => {
    try {
        const result = await User.findOne(query)
        return result 
    } catch (error) {
        console.error("User find error: ",error)
    }
}


const updateUser = async (data,id) => {
    try {
        await User.findByIdAndUpdate(id, data)
        const result = await User.findById(id)
        return result 
    } catch (error) {
        console.error("Update User error: ",error)
    }
}

module.exports = {
    createUser,
    getUser,
    updateUser,
    findOne
}