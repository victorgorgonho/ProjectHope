const fs = require('fs');
const path = require('path');

//This file works in a way that every controller created here is automatically imported to 'index.js'
module.exports = app => {
    fs
        .readdirSync(__dirname)
        .filter(file => ((file.indexOf('.'))!== 0 && (file !== "index.js")))
        .forEach(file => require(path.resolve(__dirname, file))(app));

};