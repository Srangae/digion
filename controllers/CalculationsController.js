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
const dailyTotalEmissionToken = 2400
const existingEmissionCap = 0
//Get from DB emissionPower
const existingEmissionPower = 0
const finishedEmissionPower = false
const newBurnedToken = 0
const currentSystemTotalEmissionPower = 1000


//TODO::currently difficult to do cause require data structure from FE
const getEmissionPayout = (req, res) => {
	if(finishedEmissionPower) res.json({message: "Cannot proceed"})

	const emissionPower = getUserEmissionPower()

	//current user
	//TODO:: possible bug, if the EmissionTokenAmount is too low , 2 decimal place not sufficient
	//EG: emission cap =150, emissionTokenAmount = 0.08, calculated value = 0.9994. if rounded to 2 DP it will show 1.00
	//TODO:: left calculation that involve new EmissionCap % **HAVEN CODE**
	const emission_cap = ((getEmissionCap() - getTokenForEmissionCap(getTokenForEmissionPower(emissionPower))) / getEmissionCap()).toFixed(2)

	// Divided by total emission power of whole system user.
	//TODO:: need to ask boon to check this part
	//Whats the cap and power for ?
	const emission_power = ((emissionPower - getTokenForEmissionPower(emissionPower)) / getTotalSystemEmissionPower()).toFixed(2)

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

const getUniLevelBonus = (req, res)=> {
	//get all direct parent .
	const uniLevelData = getUniLevelData()
	res.json(uniLevelData)
	//first direct parent emission power * 10%
	//other is first direct parent received bonus * 90%
	res.json(200)
}

const getDAOShare = () => {
	//TODO:: how to calculate shares?
}

/**
 * Each time system burn USD this API calculate and return the total system emission power.
 * @param req
 * @param res
 */
const storeTotalSystemEmissionPower = (req, res) => {
	const burnAmount = req.body.burn_amount
	const totalEmissionPower = (currentSystemTotalEmissionPower + (burnAmount / getTokenPrice())).toFixed(2)

	res.json({total_system_emission_power: totalEmissionPower})
}

/**
 * Emission power token/price
 * emission power = Amount user bought (USD) / token price
 *
 * EG: User bought 100 usd, today price is USD2 so user have 100/2 =50 emission power
 */
const getUserEmissionPower = () => {
	//TODO:: check if user had existing emission power. If no calculate,if yes take it to perform calculation
	//TODO:: check for new burned token if any. if it had new burned token need to recalculate and sum back to the existing
	let emissionPower = 0
	if(existingEmissionPower === 0) emissionPower = (getUserData().token / getTokenPrice()).toFixed(2)
	if(existingEmissionPower !== 0) emissionPower = existingEmissionPower
	//assume that frontend will clear the column burnedToken if this api got called cause the total EP was calculated
	if(existingEmissionPower !== 0 && newBurnedToken !== 0) emissionPower = (existingEmissionPower + (newBurnedToken / getTokenPrice())).toFixed(2)
	 return emissionPower
}

const getTotalSystemEmissionPower = () => {
	return 10000
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

/**
 *
 * Daily total emission token that are going to be generate in the system
 *
 * Emission token = Total token that the system will generate for a day. Eg: 2400 per day.
 * 2400 token then will be divided to 5 min each. 2400/24/12 = 8.3333 token each 5min.
 *
 */
const getTokenForEmissionPower = (userEmissionPower) => {
	//currently Digion are set to interval of 5min.
	const emissionTokenPerInterval = (dailyTotalEmissionToken / 24 / 12).toFixed(2)

	return (userEmissionPower / getTotalSystemEmissionPower() * emissionTokenPerInterval).toFixed(2)

}

/**
 * This uses token from the emissionpower * current token price
 * @param emissionPowerToken
 * @return {string}
 */
const getTokenForEmissionCap = (emissionPowerToken) => {
	return (emissionPowerToken * getTokenPrice()).toFixed(2)
}

const getEmissionCap = () => {
	//TODO:: get data from db
	return 150
}

const getEligibleTierData = () => {
	//TODO::frontend will return all the tree data. filter to take only maximum 3 or as stated by the docs.
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

const getUniLevelData = () => {
	return {
		2: {
			power: 10000
		},
		3: {
			power: 1000
		},
		4: {
			amount: 2000
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

/**
 * For unilevel bonus calculation.
 *
 * get the amount burned by the user to pay unilevel bonus to their parents
 */
const getUnilevelBonusEmissionPower = () => {
	//TODO:: get user burn token

}


module.exports = {
	getEmissionPayout,
	getDirectSponsorBonus,
	getDynamicSellTax,
	storeTotalSystemEmissionPower,
	getUniLevelBonus
}
