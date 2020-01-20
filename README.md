# @apacejs/jwt

### jwt.sign()

``` js
const jwt = require('@apacejs/jwt')

app.post('/login', (req, res) => {
    const { username, password } = req.body
    const userId = xxService.getUserId()

    // gene token，default expiresIn='1h'
    // const token = jwt.sign({ userId }, { expiresIn: 120 })    // expiresIn  120 second
    // const token = jwt.sign({ userId }, { expiresIn: '1d' })   // expiresIn  1 day
    const token = jwt.sign({ userId })
    res.json({ userId, token })
})
```

### jwt.verify()

It's a express middleware.

**Base Uasge**

``` js
const jwt = require('@apacejs/jwt')

app.use(jwt.verify())
```

**WhiteList**

You can set interface whitelist, which will not do authentication.

``` js
const jwt = require('@apacejs/jwt')

const whiteList = [
    { url: '/user', method: 'GET' },
    { url: '/user/:id', method: 'PUT' },
]

/**
 * e.g.1 Set all interfaces without authentication（设置所有接口都不做认证）
 * whiteList = '*'
 * 
 * e.g.2 Set part of the interface does not do authentication（设置部分接口不做认证）
 * whiteList = [
 *      { url: '/user', method: 'GET' },
 *      { url: '/user/:id', method: 'PUT' },
 * ]
 * 
 * e.g.3 Set all GET requests to do no authentication（设置所有 GET 请求都不做认证）
 * whiteList = [
 *      { url: '*', method: 'GET' },
 *      { url: '/oauth', method: 'POST' },
 * ]
 * 
 * e.g.4 Setting dynamic routing does not do authentication（设置动态路由不做认证）
 * whiteList = [
 *      // /book/1
 *      // /book/2
 *      { url: '/book/*', method: 'PUT' }
 * ]
 */
app.use(jwt.verify({ whiteList: whiteList }))

app.get('/books', (req, res) => {
    // You can retrieve data previously stored in the token, 
    // usually the userId, in the req.jwt object
    const { userId } = req.jwt
    
    // ....
})
```

**Use in Apacejs**

> [Apacejs](https://github.com/apacejs/apace-cli)：quickly develop restful API use NodeJS.

edit `.apace.js`

``` js
const jwt = require('@apacejs/jwt')

const whiteList = [
    { url: '/user', method: 'GET' },
    { url: '/user/:id', method: 'PUT' },
]

module.exports = {
    port: 8000,
    apiPrefix: '',
    routerPath: '/src/router',
    middlewares: [
        jwt.verify({ whiteList }),
    ]
};
```