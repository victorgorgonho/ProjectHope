const mongoose = require('../../database');

const CardSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: true,
    },
    description: {
        type: String,
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