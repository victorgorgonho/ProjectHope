const mongoose = require('mongoose');

//Connect to MongoDB 
mongoose.connect('mongodb+srv://victor:99341022@cluster0-p7ljz.mongodb.net/test?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true, 
    useFindAndModify: false,
});

mongoose.Promise = global.Promise;

module.exports = mongoose;

