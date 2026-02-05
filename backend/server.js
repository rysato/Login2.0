import express from 'express'
import cors from 'cors'
import { PrismaClient } from '@prisma/client'
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient()
const app = express()
const SECRET_KEY = "sua_chave_secreta_aqui" 

app.use(express.json())
app.use(cors())

app.post('/login', async (req, res) => {
    const { email } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
        return res.status(401).json({ error: "Usuário não encontrado." });
    }

    const token = jwt.sign({ id: user.id }, SECRET_KEY, { expiresIn: '1h' });
    res.status(200).json({ token });
});

const authMiddleware = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(401).json({ error: "Token não fornecido" });

    try {
        const actualToken = token.split(' ')[1];
        const verified = jwt.verify(actualToken, SECRET_KEY);
        req.user = verified;
        next();
    } catch (err) {
        res.status(400).json({ error: "Token inválido" });
    }
};

app.get('/usuarios', authMiddleware, async (req, res) => {
    const users = await prisma.user.findMany();
    res.status(200).json(users);
});

app.post('/usuarios', async (req, res) => {
    try {
        await prisma.user.create({
            data: {
                email: req.body.email,
                name: req.body.name,
                age: req.body.age
            }
        })
        res.status(201).json(req.body)
    } catch (error) {
        res.status(500).json({ error: "Erro ao criar usuário." })
    }
})

app.put('/usuarios/:id', authMiddleware, async (req, res) => {
    await prisma.user.update({
        where: { id: req.params.id },
        data: {
            email: req.body.email,
            name: req.body.name,
            age: req.body.age
        }
    })
    res.status(200).json(req.body)
})

app.delete('/usuarios/:id', authMiddleware, async (req, res) => {
    await prisma.user.delete({
        where: { id: req.params.id }
    })
    res.status(200).json({ message: "Usuário deletado!" })
})

app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000 🚀')
})