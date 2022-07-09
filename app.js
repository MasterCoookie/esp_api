const express = require('express');
const routes = require('./routes');
const mongoose = require('mongoose');
const db_pwd  = require('./db_pwd');
const bodyParser = require('body-parser');

const app = express();
app.set('view engine', 'ejs');
const port = 8080;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(routes);

const db = 'mongodb+srv://esp_api_client:' + db_pwd + '@espproject.ok0kk.mongodb.net/?retryWrites=true&w=majority';
mongoose.connect(db, {}).then(result => {
    console.log('DB connection established');
    app.listen(port);
    console.log("Listening for requests on port %s...", port);
}).catch(err => { console.log(err); });
