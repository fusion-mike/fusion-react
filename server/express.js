
import httpProxy from 'http-proxy-middleware'
import bodyParser from 'body-parser'
import express from 'express'
import path from 'path'

import options from '../start.options'
import config from '../webpack.config.babel'
import webpack from 'webpack'
import webpackMiddleware from 'webpack-dev-middleware'
import webpackHotMiddleware from 'webpack-hot-middleware'

const argv = process.argv.slice(2)
const params = require('minimist')(argv, options)

const app = express()
const compiler = webpack(config)

app.use(webpackHotMiddleware(compiler))
app.use(webpackMiddleware(compiler, {
  hot: true,
  noInfo: true,
  publicPath: config.output.publicPath
}))

let apiProxy
if (params.proxyHost && params.proxyPort) {
  apiProxy = httpProxy({
    target: 'http://' + params.proxyHost + ':' + params.proxyPort,
    changeOrigin: true,
    logLevel: 'info'
  })
}

if (apiProxy)
  app.use('/api', apiProxy)

app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'))
})

app.listen(params.port, () => {
  console.log('Fusionetics React listening on -> ', params.port)
})
