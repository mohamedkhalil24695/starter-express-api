
const express = require("express");
const router = require('./routes');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const rateLimitingConfig = require('./config/rateLimiter');
const { port, awsBucket } = require("./config/envVariables");
const AWS = require('aws-sdk');

 

const app = express();
const sequelize = require('./config/sequalize');   
app.use(cors());
app.use(rateLimitingConfig);
app.use(cookieParser());
app.use(express.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use(express.static(path.join(__dirname,'public')));

AWS.config.update({ region: awsBucket.awsRegion }); // Update with your desired region

app.use(router);

app.listen(port,()=>{
    console.log('Listening on port 3000');
}); 