const express = require('express')
const {getEmissionPayout, getDirectSponsorBonus, getDynamicSellTax} = require('../controllers/CalculationsController')
const router = express.Router()

router.route('/').get(getEmissionPayout)
router.route('/sponsor').get(getDirectSponsorBonus)
router.route('/sellTax').post(getDynamicSellTax)

module.exports = router