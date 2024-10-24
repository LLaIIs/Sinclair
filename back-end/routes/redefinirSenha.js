const express = require('express');
const crypto = require('crypto'); 
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const User = require('../models/User');

const router = express.Router();

// Configuração do nodemailer (adicionar as variáveis de ambiente)
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'mosukemono@gmail.com', 
        pass: 'qafd nrrz buxc mxyx'
    },
    tls: {
        rejectUnauthorized: false
    }
});

// Gera um código de redefinição de senha e envia por e-mail
router.post('/requere', async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }

        // Gera um código de 6 dígitos
        const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
        user.resetaSenhaToken = resetCode;
        user.resetaSenhaExpira = Date.now() + 3600000; // Expira em 1 hora
        await user.save();

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: 'Redefinição de senha',
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f4;">
                    <h2 style="color: #333;">Solicitação de Redefinição de Senha</h2>
                    <p style="font-size: 16px; color: #555;">Você solicitou uma redefinição de senha. Use o código abaixo para redefinir sua senha:</p>
                    <div style="display: inline-block; padding: 15px; margin: 20px 0; border-radius: 5px; background-color: #eaf0f6; border: 1px solid #d1e0e8;">
                        <h3 style="color: #084D6E; text-align: center; margin: 0;">${resetCode}</h3>
                    </div>
                    <p style="font-size: 14px; color: #C4A3F8;">Se você não solicitou essa redefinição, por favor ignore este e-mail.</p>
                </div>
            `
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return res.status(500).json({ error: error.message });
            } else {
                res.status(200).json({
                    message: 'Código de redefinição enviado com sucesso'
                });
            }
        });
    
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Verifica o código de redefinição
router.post('/verificaCodigo', async (req, res) => {
    const { resetaSenhaToken } = req.body;

    try {
        const user = await User.findOne({
            resetaSenhaToken,
            resetaSenhaExpira: { $gt: Date.now() }  // Verifica se o código ainda está válido
        });

        if (!user) {
            return res.status(400).json({ message: 'Código inválido ou expirado' });
        }

        res.status(200).json({ message: 'Código válido' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Redefine a senha
// Redefine a senha
router.post('/reseta', async (req, res) => {
    const { resetaSenhaToken, novaSenha, confirmarSenha } = req.body;

    // Função de verificação da senha (usada no cadastro)
    const checkPassword = (password) => {
        const minLength = 6;
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumber = /[0-9]/.test(password);
        return password.length >= minLength && hasUpperCase && hasLowerCase && hasNumber;
    };

    try {
        const user = await User.findOne({
            resetaSenhaToken,
            resetaSenhaExpira: { $gt: Date.now() }  // Verifica se o código ainda está válido
        });

        if (!user) {
            return res.status(400).json({ message: 'Código inválido ou expirado' });
        }

        // Cria um objeto de erros para armazenar erros de validação
        let errors = {};

        // Verifica a validade da nova senha
        if (!checkPassword(novaSenha)) {
            errors.novaSenha = 'A senha deve ter pelo menos 6 caracteres, incluindo letras maiúsculas, minúsculas e números.';
        }

        // Verifica se a nova senha e a confirmação coincidem
        if (novaSenha !== confirmarSenha) {
            errors.confirmarSenha = 'As senhas não correspondem.';
        }

        // Se houver erros, retorna uma resposta HTTP 400 com o objeto errors
        if (Object.keys(errors).length > 0) {
            return res.status(400).json({ errors });
        }

        // Se não houver erros, redefine a senha
        const hashedPassword = await bcrypt.hash(novaSenha, 10);
        user.senha = hashedPassword;
        user.resetaSenhaToken = undefined;
        user.resetaSenhaExpira = undefined;

        await user.save();

        res.status(200).json({ message: 'Senha redefinida com sucesso' });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao redefinir a senha.' });
    }
});

module.exports = router;
