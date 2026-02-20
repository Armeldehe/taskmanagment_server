const {Task} = require("../model")



const createTask = async (data)=> {
    try {
        const task = new Task(data)
        const result = await task.save()
        return result 
    } catch (error) {
        console.error("Error on task creation: ",error)
    }
}

const getUserTasks = async (Userid)=> {
    try {
        const result = await Task.find({owner: Userid})
        return result 
    } catch (error) {
        console.error("Task find error: ",error)
    }
}

const getOneTask = async (id)=> {
    try {
        const result = await Task.findById(id)
        return result 
    } catch (error) {
        console.error("Get one task error: ",error)
    }
}

const deleteOneTask = async(id)=> {
    try {
        const result = await Task.findByIdAndDelete(id)
        return result 
    } catch (error) {
        console.error("Error on task deletion: ",error)
    }
}

const deleteManyTask = async(arrayOfIds)=> {
    try {
        const result = await Task.deleteMany({_id: {$in: arrayOfIds}})
        return result 
    } catch (error) {
        console.error("Error on many task deletion: ",error)
    }
}

const updateTask = async (data,id)=> {
    try {
        await Task.findByIdAndUpdate(id, data)
        const result = await Task.findById(id)
        return result 
    } catch (error) {
        console.error("Update task error: ",error)
    }
}

module.exports = {
    createTask,
    deleteOneTask,
    getOneTask,
    getUserTasks,
    updateTask,
    deleteManyTask
}