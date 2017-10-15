import express from 'express'
import controllers from './controllers'

const router = express.Router()

router.route('/user')
  .get(controllers.user.get)

module.exports = router
