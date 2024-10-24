const jwt = require('jsonwebtoken');

const auth = (req, res, next) =>{ 
    const token = req.header('x-auth-token');
    if(!token) {
        return res.status(401).json({message: 'Token não fornecido'});
    }

    try{
        const decoded = jwt.verify(token, 'your_jwt_secret');
        req.userId = decoded.user.id;
        next();

    }catch(error) {
        res.status(401).json({message:'Token inválido'});

    }
};

module.exports = auth;

