'use strict'

require('./check-versions')()

const config = require('../config')
if (!process.env.NODE_ENV) {
    process.env.NODE_ENV = JSON.parse(config.dev.env.NODE_ENV)
}

const opn = require('opn')
const path = require('path')
const https = require('https')
const fs = require('fs')
const express = require('express')
const webpack = require('webpack')
const proxyMiddleware = require('http-proxy-middleware')
const webpackConfig = require('./webpack.dev.conf')

// default port where dev server listens for incoming traffic
const port = process.env.PORT || config.dev.port
    // automatically open browser, if not set will be false
const autoOpenBrowser = !!config.dev.autoOpenBrowser
    // Define HTTP proxies to your custom API backend
    // https://github.com/chimurai/http-proxy-middleware
const proxyTable = config.dev.proxyTable

const app = express()
const compiler = webpack(webpackConfig)

const devMiddleware = require('webpack-dev-middleware')(compiler, {
    publicPath: webpackConfig.output.publicPath,
    quiet: true
})

const hotMiddleware = require('webpack-hot-middleware')(compiler, {
        log: false
    })
    // force page reload when html-webpack-plugin template changes
compiler.plugin('compilation', function(compilation) {
    compilation.plugin('html-webpack-plugin-after-emit', function(data, cb) {
        hotMiddleware.publish({ action: 'reload' })
        cb()
    })
})


//ios universal link apple-app-site-association
const data = require('../static/apple-app-site-association.json')
app.get('/apple-app-site-association', function(req, res) {
    res.header("Content-Type", 'application/json')
    res.status(200).send(JSON.stringify(data))
})

//ios go appstore
app.get('/ios_ulink/*', function(req, res) {
    res.status(320).redirect('https://itunes.apple.com/app/id1533624306')
})

// enable hot-reload and state-preserving
// compilation error display
app.use(hotMiddleware)

// proxy api requests
Object.keys(proxyTable).forEach(function(context) {
    let options = proxyTable[context]
    if (typeof options === 'string') {
        options = { target: options }
    }
    app.use(proxyMiddleware(options.filter || context, options))
})

// handle fallback for HTML5 history API
app.use(require('connect-history-api-fallback')())

// serve webpack bundle output
app.use(devMiddleware)

// serve pure static assets
const staticPath = path.posix.join(config.dev.assetsPublicPath, config.dev.assetsSubDirectory)
app.use(staticPath, express.static('./static'))

const uri = 'https://localhost:' + port

let _resolve
const readyPromise = new Promise(resolve => {
    _resolve = resolve
})

console.log('> Starting dev server...')
devMiddleware.waitUntilValid(() => {
    console.log('> Listening at ' + uri + '\n')
        // when env is testing, don't need open it
        // if (autoOpenBrowser && process.env.NODE_ENV !== 'testing') {
        //   opn(uri)
        // }
    _resolve()
})

const server = https.createServer({
    key: fs.readFileSync('./ssl/dev_knowledgetalk.key'),
    cert: fs.readFileSync('./ssl/dev_knowledgetalk.pem'),
    ca: fs.readFileSync(`./ssl/dev_RootCA.crt`),
    passphrase: 'kpoint01'
}, app).listen(port)

module.exports = {
    ready: readyPromise,
    close: () => {
        server.close()
    }
}