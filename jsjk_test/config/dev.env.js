'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  VUE_APP_BASE_PATH: '"/api"',
  VUE_APP_SYS_PATH: '"/sys"',
  VUE_APP_REST_PATH: '"/rest"',
  VUE_APP_RCPT_PATH: '"/rcpt"'
})
