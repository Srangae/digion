const express = require('express')
const {getEmissionPayout, getDirectSponsorBonus, getDynamicSellTax, storeTotalSystemEmissionPower, getUniLevelBonus} = require('../controllers/CalculationsController')
const router = express.Router()

router.route('/').get(getEmissionPayout)
router.route('/sponsor').get(getDirectSponsorBonus)
router.route('/sellTax').post(getDynamicSellTax)
router.route('/storeSystemEmissionPower').post(storeTotalSystemEmissionPower)
router.route('/uniLevelBonus').get(getUniLevelBonus)

module.exports = router
