const package = {
	'default': {
		description: 'When member did not burn any DGO but bought DGO in wallet',
		emission_cap: 1.5,
		direct_sponsor: 0,
		tier: 0
	},
	'common': {
		description: '200 USD worth of DGO token',
		emission_cap: 2,
		direct_sponsor: 0.05,
		tier: 3
	},
	'uncommon': {
		description: '4 x common',
		emission_cap: 2.5,
		direct_sponsor: 0.05,
		tier: 3
	},
	'rare': {
		description: '4 x uncommon or 16 x common',
		emission_cap: 3,
		direct_sponsor: 0.05,
		tier: 3
	},
	'legendary': {
		description: '4 x rare or 16 x uncommon or 64 common',
		emission_cap: 4,
		direct_sponsor: 0.05,
		tier: 3
	},
	'mystical_god_dog': {
		description: '4 x legendary or 16 x rare or 64 x common or 256 x common',
		emission_cap: 5,
		direct_sponsor: 0.05,
		tier: 3
	},
}

/**
 * Emission token = Total token that the system will generate for a day. Eg: 2400 per day.
 * 2400 token then will be divided to 5 min each. 2400/24/12 = 8.3333 token each 5min.
 *
 */

const getEmissionPayout = (req, res) => {
	const emissionPower = getEmissionPower(getTokenPrice(), getUserData())

	const emission_cap = ((getEmissionCap() - getAmountForEmission()) / getEmissionCap()).toFixed(2)

	// Divided by total emission power of whole system user.
	const emission_power = ((emissionPower - getAmountForEmission()) / emissionPower).toFixed(2)

	res.json({emission_cap: emission_cap, emission_power: emission_power})
}

const getDirectSponsorBonus = (req, res) => {
	const sponsorTierData = Object.values(getEligibleTierData())

	const totalAmount = sponsorTierData.reduce((total,amount) => {
		return total + (amount.amount * getPackageDirectSponsorRate().rate)
	}, 0)
	res.json({sponsor_bonus: totalAmount.toFixed(2)})
}

const getDynamicSellTax = (req, res) => {
	const amountToSell = req.body
	console.log(amountToSell)
	//only applicable if current price is < previous price
	const priceDifference = (getCurrentDGOPrice() - getPreviousDGOPrice()).toFixed(2)
	//select range and get the tax amount
	const sellTax = getSellTaxAmountByRange(priceDifference)

	const finalAmount = ((amountToSell.amount * (1-sellTax)) * getCurrentDGOPrice()).toFixed(2)

	res.json({sell_amount: finalAmount})
}

/**
 * Emission power token/price
 */
const getEmissionPower = (tokenPrice, userData) => {
	 return userData.token / tokenPrice
}

const getTokenPrice = () => {
	//TODO::get real time DGO price
	return 1
}

const getUserData = () => {
	//TODO::get from db
	return {
		token: 100
	}
}

const getAmountForEmission = () => {
	//TODO:: get real time data
	return 1
}

const getEmissionCap = () => {
	//TODO:: get data from db
	return 150
}

const getEligibleTierData = () => {
	return {
		2: {
			amount: 200
		},
		3: {
			amount: 400
		},
		4: {
			amount: 1000
		}
	}
}

const getPackageDirectSponsorRate = () => {
	return {
		rate: 0.05
	}
}

const getCurrentDGOPrice = () => {
	return 0.8
}

const getPreviousDGOPrice = () => {
	return 1
}

const getSellTaxAmountByRange = (priceRange) => {
	return 0.15
}


module.exports = {
	getEmissionPayout,
	getDirectSponsorBonus,
	getDynamicSellTax
}