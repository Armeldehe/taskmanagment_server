const taskRepo = require('../DB/repository/task.repo')

const postTask = async(req,res)=> {
    console.log('text:', req.body);
    const body = req.body
    const result = await taskRepo.createTask(body)
    return res.json(result)
}

const putTask = async(req,res)=> {
    const body = req.body
    const {taskId:id} = req.params
    const result = await taskRepo.updateTask(body, id)
    return res.json(result)
}

const getTasks = async(req,res)=> {
    const {userId} = req.params
    const result = await taskRepo.getUserTasks(userId)
    return res.json(result)
}

const deleteOneTask = async(req,res)=> {
    const {taskId} = req.params
    const result = await taskRepo.deleteOneTask(taskId)
    return res.json(result)
}

const deleteManyTask = async(req,res)=> {
    const {taskIds} = req.body
    const result = await taskRepo.deleteManyTask(taskIds)
    return res.json(result)
}

module.exports = {
    putTask,
    getTasks,
    deleteManyTask,
    deleteOneTask,
    postTask
}