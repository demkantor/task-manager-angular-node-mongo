const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

const { List, Task, User } = require('../db/models');


// set user auth middleware //
// check whether the request has a valid JWT access token
let authenticate = (req, res, next) => {
    let token = req.header('x-access-token');
    // verify the JWT
    jwt.verify(token, User.getJWTSecret(), (err, decoded) => {
        if (err) {
            // there was an error
            // jwt is invalid - * DO NOT AUTHENTICATE *
            res.status(401).send(err);
        } else {
            // jwt is valid
            req.user_id = decoded._id;
            next();
        }
    });
}


// get all lists from database
router.get('/',  authenticate, (req, res) =>{
    console.log('in GET all lists');
    List.find({
        _userId: req.user_id
    }).then((lists)=>{
        console.table(lists);
        res.send(lists);
    }).catch((err)  => {
        res.send(err)
    });
});

// add a new list to database
router.post('/', authenticate, (req, res) => {
    console.log('in POST new list', req.body.title);
    let title = req.body.title;
    let newList = new List({
        title,
        _userId: req.user_id
    });
    newList.save().then((listDoc)=>{
        console.log(listDoc);
        res.send(listDoc);
    });
});

// update list with new values
router.patch('/:id', authenticate, (req, res)=>{
    console.log('in UPDATE list', req.body, req.params.id);
    List.findOneAndUpdate({ _id: req.params.id, _userId: req.user_id },  {
        $set: req.body
    }).then(()=>{
        res.send({ 'message': 'updated successfully'});
    });
});

// delete a list by id
router.delete('/:id', authenticate, (req, res)=>{
    console.log('in DELETE list', req.body, req.params.id);
    List.findOneAndRemove({
        _id: req.params.id,
        _userId: req.user_id
    }).then((removeListDoc)=>{
        res.send(removeListDoc);
        // delete all the tasks that are in the deleted list
        deleteTasksFromList(removeListDoc._id);
    });
});

//  get all tasks to a specific list
router.get('/:listId/tasks', authenticate, (req, res)=>{
    console.log('in GET all tasks:',  req.params.listId);
    Task.find({
        _listId: req.params.listId
    }).then((tasks)=>{
        res.send(tasks);
    });
});

//  get specific task from specific list by id
router.get('/:listId/tasks/:taskId', (req, res)=>{
    console.log('in GET specific task:', req.params.taskId, req.params.listId);
    Task.findOne({
        _id: req.params.taskId,
        _listId: req.params.listId
    }).then((task)=>{
        res.send(task);
    });
});

// add a new task to a specific list
router.post('/:listId/tasks', authenticate, (req, res) => {
    console.log('in POST new task', req.body.title, req.params.listId);
    List.findOne({
        _id: req.params.listId,
        _userId: req.user_id
    }).then((list) => {
        if (list) {
            return true;
        }
        return false;
    }).then((canCreateTask) => {
        if (canCreateTask) {
            let newTask= new Task({
                title: req.body.title,
                _listId: req.params.listId
            });
            newTask.save().then((newTaskDoc)=>{
                console.log(newTaskDoc);
                res.send(newTaskDoc);
            });
        } else {
            res.sendStatus(404);
        }
    })
});

// update task to a specific list by id
router.patch('/:listId/tasks/:taskId', authenticate, (req, res)=>{
    console.log('in UPDATE task', req.body, req.params.taskId, req.params.listId);
    List.findOne({
        _id: req.params.listId,
        _userId: req.user_id
    }).then((list) => {
        if (list) {
            // list object with the specified conditions was found
            // therefore the currently authenticated user can make updates to tasks within this list
            return true;
        }
        return false;
    }).then((canUpdateTasks) => {
        if (canUpdateTasks) {
            Task.findOneAndUpdate({
                _id: req.params.taskId,
                _listId: req.params.listId
            },  {
                $set: req.body
            }).then(()=>{
                res.send({message: 'Updated Successfully!'});
            });
        } else {
            res.sendStatus(404);
        }
    })
});

// delete task to a specific list by id
router.delete('/:listId/tasks/:taskId',  authenticate, (req, res)=>{
    console.log('in DELETE task', req.body, req.params.taskId, req.params.listId);
    List.findOne({
        _id: req.params.listId,
        _userId: req.user_id
    }).then((list) => {
        if (list) {
            // list object with the specified conditions was found
            // therefore the currently authenticated user can make updates to tasks within this list
            return true;
        }
        // else - the list object is undefined
        return false;
    }).then((canDeleteTasks) => {
        if (canDeleteTasks) {
            Task.findOneAndRemove({
                _id: req.params.taskId,
                _listId: req.params.listId
            }).then((removeTaskDoc)=>{
                res.send(removeTaskDoc);
            });
        } else {
            res.sendStatus(404);
        }
    });
});


/* HELPER METHODS*/
let deleteTasksFromList = (_listId) => {
    Task.deleteMany({
        _listId
    }).then(() => {
        console.log("Tasks from " + _listId + " were deleted!");
    })
}



module.exports = router;