const mongoose = require('../../database');

const CardSchema = new mongoose.Schema({
    title: {
        type: String,
    },
    type: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    link: {
        type: String,
    },
    image: {
        type: String,
    }
});

const Card = mongoose.model('Card', CardSchema);

module.exports = Card;