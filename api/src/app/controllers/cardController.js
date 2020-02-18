const express = require('express');
const authMiddleware = require('../middlewares/auth');
const Card = require('../models/cards');

const router = express.Router();

router.use(authMiddleware);

//Create new card
router.post('/create_card', async (req, res) => {
    try {
        const { title, type, description, link, image } = req.body;

        const card = await Card.create({ title, type, description, link, image });

        return res.send({ card });
    } catch (err) {
        return res.status(400).send({ erro: 'Falha ao criar novo card' });
    }
});

//List registered cards
router.get('/', async (req, res) => {
    try {
        const cards = await Card.find()

        return res.send({ cards });
    } catch (err) {
        return res.status(400).send({ erro: 'Falha ao carregar cards' });
    }
});

//Update existing card
router.put('/:cardId', async (req, res) => {
    try {
        const { title, type, description, link, image } = req.body;

        const card = await Card.findByIdAndUpdate(req.params.cardId, { 
            title, 
            type, 
            description, 
            link, 
            image
         }, { new: true });

        return res.send({ card });
    } catch(err) {
        return res.status(400).send({ erro: 'Falha ao atualizar card' });
    }
});

//Delete card
router.delete('/:cardId', async (req, res) => {
    try {
        await Card.findByIdAndRemove(req.params.cardId);

        return res.send();
    } catch(err) {
        return res.status(400).send({ erro: 'Falha ao deletar card' });
    }
});

module.exports = app => app.use('/cards', router);