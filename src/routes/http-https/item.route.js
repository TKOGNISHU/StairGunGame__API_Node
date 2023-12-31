const express = require('express')
const router = express.Router()
const { ItemController } = require('../../app/controllers')

router.get('/', ItemController.getAll)
router.post('/buy', ItemController.buy)
router.post('/sell', ItemController.sellItem)

module.exports = router
