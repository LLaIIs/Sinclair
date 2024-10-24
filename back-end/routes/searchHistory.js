const express = require('express');
const SearchHistory = require('../models/SearchHistory');
const auth = require('../middlewares/auth');

const router = express.Router();

// Rota para adicionar uma nova pesquisa ao histórico
router.post('/add', auth, async (req, res) => { // Adiciona o middleware 'auth'
  try {
    const { query, place_id } = req.body;
    const userId = req.userId; // Pega o userId do token decodificado

    const existingEntry = await SearchHistory.findOne({ userId, query });
    if (existingEntry) {
      return res.status(400).json({ message: 'Pesquisa já existe no histórico.' });
    }

    const newSearchHistory = new SearchHistory({ userId, query, place_id });
    await newSearchHistory.save();
    res.status(201).json(newSearchHistory);
  } catch (error) {
    console.error('Erro ao adicionar ao histórico:', error);
    res.status(500).json({ message: 'Erro ao adicionar ao histórico' });
  }
});

// Rota para obter o histórico de pesquisas
router.get('/get', auth, async (req, res) => { // Adiciona o middleware 'auth'
  try {
    const userId = req.userId; // Pega o userId do token decodificado

    const searchHistory = await SearchHistory.find({ userId }).sort({ createdAt: -1 });
    res.status(200).json(searchHistory);
  } catch (error) {
    console.error('Erro ao obter o histórico:', error);
    res.status(500).json({ message: 'Erro ao obter o histórico' });
  }
});

// Rota para apagar o histórico de pesquisas
router.delete('/delete', auth, async (req, res) => { // Adiciona o middleware 'auth'
  try {
    const userId = req.userId; // Pega o userId do token decodificado

    await SearchHistory.deleteMany({ userId });
    res.status(200).json({ message: 'Histórico de pesquisas apagado com sucesso' });
  } catch (error) {
    console.error('Erro ao apagar o histórico:', error);
    res.status(500).json({ message: 'Erro ao apagar o histórico' });
  }
});

module.exports = router;