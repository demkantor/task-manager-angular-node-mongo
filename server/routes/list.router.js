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
        console.table(listDoc);
        res.send(listDoc);
    })
});


// update list with new values
router.patch('/:id', (req, res)=>{
    console.log('in UPDATE list', req.body, req.params.id);
});


// delete a list by id
router.delete('/:id', (req, res)=>{
    console.log('in DELETE list', req.body, req.params.id);
});


module.exports = router;