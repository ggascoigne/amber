'use strict'

import express from 'express'
import bodyParser from 'body-parser'
import settings from 'config'
import routes from './routes'

const app = express()

app.use(bodyParser.urlencoded({extended: true}))

// const swaggerUi = require('swagger-ui-express')
// const swaggerDocument = require('./swagger.json')
// app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

app.use('/', routes)

app.listen(settings.port, () => {
  console.log(`Contacts server listening on port ${settings.port}.`)
})
