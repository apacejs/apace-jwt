const express = require('express')
const app = express()

const jwt = require('../lib/index')

app.use(jwt.verify({
    whiteList: [{ url: '/login', method: '*' }],
    blackList: [{ url: '/book/*', method: 'GET' }]
}))

app.get('/login', (req, res) => {
    try {
        const token = jwt.sign({ username: 'hello dk' })
        res.json({ token })
    } catch (e) {
        res.status(500).json({
            code: 500,
            message: e.message
        })
    }
})

app.get('/books/:id', (req, res) => {
    res.json({
        jwt: req.jwt,
        id: req.params.id,
    })
})

app.listen(31000, () => console.log('server is start on listen: 31000'))