const express = require('express')
const jwt = require('../../lib/index').default

const app = express()

app.use(jwt.verify({
    whiteList: [{ url: '/login', method: '*' }],
    blackList: [{ url: '/book/*', method: 'GET' }]
}))

/**
 * 白名单接口
 * 
 * 请求，返回 token 字符串
 */
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

/**
 * 黑名单接口
 * 
 * 直接请求，可以看到 401 未认证
 * 携带 token 请求，可以看到正常拿到结果
 */
app.get('/books/:id', (req, res) => {
    res.json({
        jwt: req.jwt,
        id: req.params.id,
    })
})

app.listen(31000, () => console.log('server is start on listen: 31000')) 