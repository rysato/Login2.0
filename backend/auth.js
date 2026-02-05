import jwt from 'jsonwebtoken';

const SECRET_KEY = "sua_chave_secreta_aqui"; 

export const authMiddleware = (req, res, next) => {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(401).json({ error: "Acesso negado. Token não fornecido." });
    }

    try {
        const actualToken = token.split(' ')[1];
        const verified = jwt.verify(actualToken, SECRET_KEY);
        req.user = verified;
        next();
    } catch (err) {
        res.status(400).json({ error: "Token inválido." });
    }
};

export const generateToken = (userId) => {
    return jwt.sign({ id: userId }, SECRET_KEY, { expiresIn: '1h' });
};