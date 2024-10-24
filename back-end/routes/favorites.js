const express = require('express');
const Favorite = require('../models/Favorite');
const auth = require('../middlewares/auth');

const router = express.Router();

// Adicionar ou remover item dos favoritos
router.post('/toggle', auth, async (req, res) => {
    const { itemId, imageUrl, title } = req.body;
    const userId = req.userId;

    try {
        // Verifica se o item já está na lista de favoritos
        const existingFavorite = await Favorite.findOne({ userId, itemId });

        if (existingFavorite) {
            // Se já estiver na lista de favoritos, remove
            await Favorite.deleteOne({ userId, itemId });
            res.status(200).json({ message: 'Favorito removido!' });
        } else {
            // Se não estiver na lista de favoritos, adiciona
            const newFavorite = new Favorite({ userId, itemId, imageUrl, title});
            await newFavorite.save();
            res.status(201).json({ message: 'Favorito adicionado!' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Erro ao adicionar/remover favorito', error });
    }
});

// Listar os itens favoritos de um usuário
router.get('/', auth, async (req, res) => {
    const userId = req.userId;

    try {
        const favorites = await Favorite.find({ userId });
        res.status(200).json(favorites);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao listar favoritos', error });
    }
});

module.exports = router;
