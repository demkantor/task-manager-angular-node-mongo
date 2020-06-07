const express = require('express');
const app = express();
const { mongoose } = require('./db/mongoose');
const bodyParser = require('body-parser');

// set middleware
app.use(bodyParser.json());
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, HEAD, OPTIONS, PUT, PATCH, DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-access-token, x-refresh-token, _id");
    res.header(
        'Access-Control-Expose-Headers',
        'x-access-token, x-refresh-token'
    );
    next();
});


//  routes 
const listRouter = require('./routes/list.router');
const userRouter = require('./routes/user.router');
app.use('/lists', listRouter);
app.use('/users', userRouter);


// set port and listen...
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`server is listening at port: ${PORT}`)
});