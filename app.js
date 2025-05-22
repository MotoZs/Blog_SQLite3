import express from 'express'
import * as db from './util/database.js'

const PORT = 8080
const app = express()

app.use(express.json())

// USERS
app.get('/users', async (req, res) => {
    try {
        const users = await db.getUsers()
        res.status(200).json(users)
    } catch (err) {
        res.status(500).json({ message: `${err}` })
    }
})

app.get('/users/:id', async (req, res) => {
    try {
        const user = await db.getUser(req.params.id)
        if (!user) return res.status(404).json({ message: 'User not found' })
        res.status(200).json(user)
    } catch (err) {
        res.status(500).json({ message: `${err}` })
    }
})

app.post('/users', async (req, res) => {
    try {
        const { name, age } = req.body
        if (!name || !age) return res.status(400).json({ message: 'Invalid' })
        const savedUser = await db.savedUser(name, age)
        res.status(201).json({ id: savedUser.lastID, name, age })
    } catch (err) {
        res.status(500).json({ message: `${err}` })
    }
})

app.put('/users/:id', async (req, res) => {
    try {
        const { name, age } = req.body
        if (!name || !age) return res.status(400).json({ message: 'Invalid' })
        const updated = await db.updatedUser(req.params.id, name, age)
        if (updated.changes !== 1) return res.status(404).json({ message: 'Update failed' })
        res.status(200).json({ id: req.params.id, name, age })
    } catch (err) {
        res.status(500).json({ message: `${err}` })
    }
})

app.delete('/users/:id', async (req, res) => {
    try {
        const deleted = await db.deleteUser(req.params.id)
        if (deleted.changes !== 1) return res.status(404).json({ message: 'Delete failed' })
        res.status(200).json({ message: 'User deleted' })
    } catch (err) {
        res.status(500).json({ message: `${err}` })
    }
})

// POSTS
app.get('/posts', async (req, res) => {
    try {
        const posts = await db.getPosts()
        res.status(200).json(posts)
    } catch (err) {
        res.status(500).json({ message: `${err}` })
    }
})

app.get('/posts/:id', async (req, res) => {
    try {
        const post = await db.getPost(req.params.id)
        if (!post) return res.status(404).json({ message: 'Post not found' })
        res.status(200).json(post)
    } catch (err) {
        res.status(500).json({ message: `${err}` })
    }
})

app.post('/posts', async (req, res) => {
    try {
        const { title, authorId, category, content } = req.body
        if (!title || !authorId || !category || !content) {
            return res.status(400).json({ message: 'Invalid post data' })
        }
        const result = await db.savePost({ title, authorId, category, content })
        res.status(201).json({ id: result.lastID, title, authorId, category, content })
    } catch (err) {
        res.status(500).json({ message: `${err}` })
    }
})

app.put('/posts/:id', async (req, res) => {
    try {
        const { title, category, content } = req.body
        if (!title || !category || !content) {
            return res.status(400).json({ message: 'Invalid post data' })
        }
        const result = await db.updatePost(req.params.id, { title, category, content })
        if (result.changes !== 1) return res.status(404).json({ message: 'Update failed' })
        res.status(200).json({ id: req.params.id, title, category, content })
    } catch (err) {
        res.status(500).json({ message: `${err}` })
    }
})

app.delete('/posts/:id', async (req, res) => {
    try {
        const result = await db.deletePost(req.params.id)
        if (result.changes !== 1) return res.status(404).json({ message: 'Delete failed' })
        res.status(200).json({ message: 'Post deleted successfully' })
    } catch (err) {
        res.status(500).json({ message: `${err}` })
    }
})

app.listen(PORT, () => {
    console.log(`A szerver fut: http://localhost:${PORT}`)
})
