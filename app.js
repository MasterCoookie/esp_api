const express = require('express');
const routes = require('./routes');


const app = express();
app.set('view engine', 'ejs');

const port = 8080;

app.use(routes);

app.listen(port);

console.log("Listening for requests on port %s...", port);