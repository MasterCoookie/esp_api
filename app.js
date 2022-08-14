const express = require('express');
const routes = require('./routes');
const mongoose = require('mongoose');
const db_pwd  = require('./db_pwd');
const bodyParser = require('body-parser');
const https = require("https");
const http = require("http");
const fs = require('fs');

const app = express();
app.set('view engine', 'ejs');
const portHTTPS = 8080;
const portHTTP = 8081;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(routes);

const db = 'mongodb+srv://esp_api_client:' + db_pwd + '@espproject.ok0kk.mongodb.net/?retryWrites=true&w=majority';
mongoose.connect(db, {}).then(result => {
    console.log('DB connection established');
    https.createServer({
        key: fs.readFileSync("key.pem"),
        cert: fs.readFileSync("cert.pem"),
      },app).listen(portHTTPS, ()=>{
        console.log('Listening for %i requests on port 8081...', portHTTPS);
    });
    http.createServer({
    },app).listen(portHTTP, ()=>{
      console.log('Listening for %i requests on port 8080...', portHTTP);
  });
}).catch(err => { console.log(err); });
