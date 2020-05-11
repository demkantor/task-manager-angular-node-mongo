const express = require('express');
const router = express.Router();


// get all lists from database
router.get('/', (req, res) =>{
    console.log('in GET all lists', req.body, req.params);
    res.send('hello world!');
});


// add a new list to database
router.post('/', (req, res) => {
    console.log('in POST new list', req.body, req.params);
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