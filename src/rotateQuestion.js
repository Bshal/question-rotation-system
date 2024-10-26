const { getCurrentCycle, updateCycle } = require('./utils/dynamodbHelper')

exports.handler = async (event) => {
	const { region, cycleDuration } = event
	const currentCycle = await getCurrentCycle(region)

	const nextCycle = (currentCycle % cycleDuration) + 1
	await updateCycle(region, nextCycle)
}
