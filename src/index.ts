import jwt from 'jsonwebtoken'
import HttpStatus from 'http-status-codes'
import { Request, Response, NextFunction } from 'express'

const secretKey = 'apace-jwt'

interface ISignOpts {
    expiresIn: string | number;
    [key: string]: any;
}

function sign(payload: { [key: string]: any }, opts: ISignOpts = { expiresIn: '1h' }): string {
    const { expiresIn } = opts
    try {
        const token = jwt.sign(payload, secretKey, { expiresIn })
        return token
    } catch (e) {
        throw new Error(e.message)
    }
}

/**
 * e.g.1 设置所有接口都不做认证
 * whiteList = '*'
 * 
 * e.g.2 设置部分接口不做认证
 * whiteList = [
 *      { url: '/user', method: 'GET' },
 *      { url: '/user/:id', method: 'PUT' },
 * ]
 * 
 * e.g.3 设置所有 GET 请求都不做认证
 *       设置特定接口所有请求方式都不做认证
 * whiteList = [
 *      { url: '*', method: 'GET' },
 *      { url: '/oauth', method: '*' },
 * ]
 * 
 * e.g.4 设置动态路由不做认证
 * whiteList = [
 *      // /book/1
 *      // /book/2
 *      { url: '/book/*', method: 'PUT' }
 * ]
 */
interface IList {
    url?: string;
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'OPTIONS' | 'PATCH' | '*'
}

interface IVerifyOpts {
    whiteList: string | IList[];
    blackList: IList[];
}

function verify({ whiteList = '*', blackList = [] }: IVerifyOpts) {
    return function (req: Request & { jwt: object }, res: Response, next: NextFunction) {
        // header 中拿 token
        const authorization = req.headers.authorization

        if (authorization) {
            try {
                const token = authorization.split(' ').pop() || ''
                const result = jwt.verify(token, secretKey) as object
                req.jwt = result   // 加密字段存入 req.jwt 对象中
            } catch (e) {
                return res.status(HttpStatus.UNAUTHORIZED).json({
                    code: HttpStatus.UNAUTHORIZED,
                    message: e.message,
                })
            }

            return next()
        }

        // BlackList
        const { url, method } = req
        for (let routeObj of blackList) {
            routeObj.url = routeObj.url || '*'
            routeObj.method = routeObj.method || '*'
            if (
                (routeObj.url === url || routeObj.url === '*' || patternMatch(routeObj.url, url)) &&
                (equality(routeObj.method, method) || equality(routeObj.method, '*'))
            ) {
                return res.status(HttpStatus.UNAUTHORIZED)
                    .json({
                        code: HttpStatus.UNAUTHORIZED,
                        message: HttpStatus.getStatusText(HttpStatus.UNAUTHORIZED),
                    })
            }
        }

        // WhiteList
        if (typeof whiteList === 'string') {
            if (whiteList === '*') {
                return next()
            }
        } else if (Array.isArray(whiteList)) {
            for (let routeObj of whiteList) {
                routeObj.url = routeObj.url || '*'
                routeObj.method = routeObj.method || '*'
                if (
                    (routeObj.url === url || routeObj.url === '*' || patternMatch(routeObj.url, url)) &&
                    (equality(routeObj.method, method) || equality(routeObj.method, '*'))
                ) {
                    return next()
                }
            }
        } else {
            console.log('jwt-verify() param error: whiteList must String or Array.')
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .json({
                    code: HttpStatus.INTERNAL_SERVER_ERROR,
                    message: HttpStatus.getStatusText(HttpStatus.UNAUTHORIZED),
                })
        }

        return res.status(HttpStatus.UNAUTHORIZED)
            .json({
                code: HttpStatus.UNAUTHORIZED,
                message: HttpStatus.getStatusText(HttpStatus.UNAUTHORIZED),
            })
    }
}

function equality(a: string, b: string): boolean {
    return String(a).toLowerCase() === String(b).toLowerCase()
}

/**
 * regexUrl 规则
 * reqUrl = req.url
 * 
 * e.g.1
 * regexUrl = '/user/*'
 * reqUrl = '/user/1'
 * patternMatch(regexUrl, reqUrl)   // true
 */
function patternMatch(regexUrl: string, reqUrl: string): boolean {
    // 去除末尾斜杠
    if (regexUrl[regexUrl.length - 1] === '/') {
        regexUrl = regexUrl.substring(0, regexUrl.length - 1)
    }
    if (reqUrl[reqUrl.length - 1] === '/') {
        reqUrl = reqUrl.substring(0, reqUrl.length - 1)
    }

    const regexUrlArr = regexUrl.split('/')
    const reqUrlArr = reqUrl.split('/')
    if (regexUrlArr.length !== reqUrlArr.length) {
        return false
    }

    const length = Math.max(regexUrlArr.length, reqUrlArr.length)
    for (let i = 0; i < length; i++) {
        if (regexUrlArr[i] !== reqUrlArr[i] && regexUrlArr[i] !== '*') {
            return false
        }
    }
    return true
}

exports.sign = sign
exports.verify = verify