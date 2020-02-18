const express = require ('express');
const bodyParser = require ('body-parser');

const app = express();

//Create an Express application to manage URLs and routes

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : false }));

require('./app/controllers/index')(app);

app.listen(3000);