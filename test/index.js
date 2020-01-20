const express = require('express')
const app = express()

const jwt = require('../lib/index')

app.use(jwt.verify({ whiteList: [{ url: '/books/*', method: 'GET' }] }))

app.get('/login', (req, res) => {
    try {
        const token = jwt.sign({ username: 'dkvirus' })
        res.json({ token })
    } catch (e) {
        res.status(500).json({
            code: 500,
            message: e.message
        })
    }
})

app.get('/books/:id', (req, res) => {
    const { id } = req.params
    console.log('id', id)

    res.json({
        message: 'url is /books/:id'
    })
})

app.listen(8200, () => console.log('server is start on listen: 8200'))