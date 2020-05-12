const express = require('express');
const router = express.Router();

const { List, Task } = require('../db/models');


// get all lists from database
router.get('/', (req, res) =>{
    console.log('in GET all lists');
    List.find({}).then((lists)=>{
        console.table(lists);
        res.send(lists);
    })
});


// add a new list to database
router.post('/', (req, res) => {
    console.log('in POST new list', req.body.title);
    let title = req.body.title;
    let newList = new List({
        title
    });
    newList.save().then((listDoc)=>{
        console.log(listDoc);
        res.send(listDoc);
    });
});


// update list with new values
router.patch('/:id', (req, res)=>{
    console.log('in UPDATE list', req.body, req.params.id);
    List.findOneAndUpdate({_id: req.params.id},  {
        $set: req.body
    }).then(()=>{
        res.sendStatus(200);
    });
});


// delete a list by id
router.delete('/:id', (req, res)=>{
    console.log('in DELETE list', req.body, req.params.id);
    List.findOneAndRemove({
        _id: req.params.id
    }).then((removeListDoc)=>{
        res.send(removeListDoc);
    });
});

//  get all tasks to a specific list
router.get('/:listId/tasks', (req, res)=>{
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
router.post('/:listId/tasks', (req, res) => {
    console.log('in POST new task', req.body.title, req.params.listId);
    let newTask= new Task({
        title: req.body.title,
        _listId: req.params.listId
    });
    newTask.save().then((newTaskDoc)=>{
        console.log(newTaskDoc);
        res.send(newTaskDoc);
    });
});

// update task to a specific list by id
router.patch('/:listId/tasks/:taskId', (req, res)=>{
    console.log('in UPDATE task', req.body, req.params.taskId, req.params.listId);
    Task.findOneAndUpdate({
        _id: req.params.taskId,
        _listId: req.params.listId
    },  {
        $set: req.body
    }).then(()=>{
        res.send({message: 'Updated Successfully!'});
    });
});


// delete task to a specific list by id
router.delete('/:listId/tasks/:taskId', (req, res)=>{
    console.log('in DELETE task', req.body, req.params.taskId, req.params.listId);
    Task.findOneAndRemove({
        _id: req.params.taskId,
        _listId: req.params.listId
    }).then((removeTaskDoc)=>{
        res.send(removeTaskDoc);
    });
});



module.exports = router;