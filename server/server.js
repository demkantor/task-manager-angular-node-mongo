const express = require('express');
const app = express();
const bodyParser = require('body-parser');

// set middleware
app.use(bodyParser.json());

//  routes 
const listRouter = require('./routes/list.router');
app.use('/lists', listRouter);


// set port and listen...
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`server is listening at port: ${PORT}`)
});