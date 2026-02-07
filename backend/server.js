import express from 'express'
import cors from 'cors'
import { PrismaClient } from '@prisma/client'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()
const app = express()
const SECRET_KEY = "sua_chave_secreta" 

app.use(express.json())
app.use(cors())

app.post('/usuarios', async (req, res) => {
    try {
        const { email, name, age, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        await prisma.user.create({
            data: { email, name, age, password: hashedPassword }
        });
        res.status(201).json({ message: "Criado com sucesso" });
    } catch (error) {
        res.status(400).json({ error: "E-mail já cadastrado" });
    }
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });

    if (user && await bcrypt.compare(password, user.password)) {
        const token = jwt.sign({ id: user.id }, SECRET_KEY, { expiresIn: '1h' });
        return res.json({ token });
    }
    res.status(401).json({ error: "Credenciais inválidas" });
});

const authMiddleware = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.status(401).json({ error: "Não autorizado" });

    try {
        req.user = jwt.verify(token, SECRET_KEY);
        next();
    } catch {
        res.status(401).json({ error: "Token inválido" });
    }
};

app.get('/usuarios', authMiddleware, async (req, res) => {
    const users = await prisma.user.findMany();
    res.json(users);
});

app.delete('/usuarios/:id', authMiddleware, async (req, res) => {
    await prisma.user.delete({ where: { id: req.params.id } });
    res.json({ message: "Usuário deletado" });
});

app.listen(3000, () => console.log('Servidor rodando'))