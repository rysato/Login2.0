import express from 'express'
import cors from 'cors'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const app = express()

app.use(express.json())
app.use(cors())

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

app.get('/usuarios', async (req, res) => {
    let users = []
    if (req.query.name || req.query.email || req.query.age) {
        users = await prisma.user.findMany({
            where: {
                name: req.query.name,
                email: req.query.email,
                age: req.query.age
            }
        })
    } else {
        users = await prisma.user.findMany()
    }
    res.status(200).json(users)
})

app.put('/usuarios/:id', async (req, res) => {
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

app.delete('/usuarios/:id', async (req, res) => {
    await prisma.user.delete({
        where: { id: req.params.id }
    })
    res.status(200).json({ message: "Usuário deletado!" })
})

app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000 🚀')
})