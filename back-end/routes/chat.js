const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const Chat = require('../models/Chat'); 



// Rota para salvar uma mensagem
router.post('/save-message', auth, async (req, res) => {
  const { chatSessionId, message, sender } = req.body;
  const userId = req.userId; // Usa o userId do token

  if (!chatSessionId || !message || !sender) {
    return res.status(400).json({ error: 'Faltam parâmetros obrigatórios.' });
  }

  try {
    let chatSession = await Chat.findOne({ chatSessionId, userId });

    if (!chatSession) {
      chatSession = new Chat({
        userId,
        chatSessionId,
        messages: [],
      });
    }

    chatSession.messages.push({
      id: Date.now().toString(),
      sender,
      text: message,
      createdAt: new Date(),
    });

    chatSession.lastMessageAt = new Date();
    await chatSession.save();

    res.status(200).json({ success: 'Mensagem salva com sucesso!' });
  } catch (error) {
    console.error('Erro ao salvar mensagem:', error);
    res.status(500).json({ error: 'Erro ao salvar mensagem.' });
  }
});

// Rota para criar uma nova sessão de chat
router.post('/create-chat', auth, async (req, res) => {
  const userId = req.userId; // Usa o userId do token

  try {
    const newChatSession = new Chat({
      userId,
      chatSessionId: Date.now().toString(),
      messages: [],
    });

    await newChatSession.save();
    res.status(200).json({ success: 'Nova sessão de chat criada!', chatSessionId: newChatSession.chatSessionId });
  } catch (error) {
    console.error('Erro ao criar nova sessão de chat:', error);
    res.status(500).json({ error: 'Erro ao criar nova sessão de chat.' });
  }
});
// Rota para obter todos os chats do usuário
router.get('/get-chats', auth, async (req, res) => {
  const userId = req.userId; // Usa o userId do token

  try {
    // Busca todos os chats associados ao userId
    const chats = await Chat.find({ userId });
    
    res.status(200).json(chats); // Retorna a lista de chats
  } catch (error) {
    console.error('Erro ao obter chats:', error);
    res.status(500).json({ error: 'Erro ao obter chats.' });
  }
});


// Rota para deletar um chat inteiro
router.delete('/delete-chat/:chatSessionId', auth, async (req, res) => {
  const { chatSessionId } = req.params;
  const userId = req.userId; // Usa o userId do token

  try {
    // Deletar a sessão de chat com base no chatSessionId e userId
    await Chat.deleteOne({ chatSessionId, userId });

    res.status(200).json({ success: 'Chat deletado com sucesso!' });
  } catch (error) {
    console.error('Erro ao deletar o chat:', error);
    res.status(500).json({ error: 'Erro ao deletar o chat.' });
  }
});

router.get('/get-messages/:chatSessionId', auth, async (req, res) => {
  const { chatSessionId } = req.params;
  const userId = req.userId; // Usa o userId do token

  try {
    const chatSession = await Chat.findOne({ chatSessionId, userId });

    if (!chatSession) {
      return res.status(404).json({ error: 'Sessão de chat não encontrada.' });
    }

    res.status(200).json({ messages: chatSession.messages }); // Retorna as mensagens da sessão de chat
  } catch (error) {
    console.error('Erro ao obter mensagens:', error);
    res.status(500).json({ error: 'Erro ao obter mensagens.' });
  }
  
});


router.patch('/update-chat-name/:chatSessionId', auth, async (req, res) => {
  const { chatSessionId } = req.params;
  const { name } = req.body; // Novo nome do chat
  const userId = req.userId; // Usa o userId do token

  if (!name) {
    return res.status(400).json({ error: 'Nome do chat é obrigatório.' });
  }

  try {
    const chatSession = await Chat.findOne({ chatSessionId, userId });

    if (!chatSession) {
      return res.status(404).json({ error: 'Sessão de chat não encontrada.' });
    }

    chatSession.name = name; 
    await chatSession.save();

    res.status(200).json({ success: 'Nome do chat atualizado com sucesso!' });
  } catch (error) {
    console.error('Erro ao atualizar o nome do chat:', error);
    res.status(500).json({ error: 'Erro ao atualizar o nome do chat.' });
  }
});


module.exports = router;