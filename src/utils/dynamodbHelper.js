const dynamo = require('./dynamodbClient')

exports.getCurrentCycle = async (region) => {
	const cycleConfig = await dynamo
		.get({
			TableName: process.env.CYCLE_CONFIG_TABLE,
			Key: { region },
		})
		.promise()
	return cycleConfig.Item.CurrentCycle
}

exports.updateCycle = async (region, nextCycle) => {
	await dynamo
		.update({
			TableName: process.env.CYCLE_CONFIG_TABLE,
			Key: { region },
			UpdateExpression: 'set CurrentCycle = :nextCycle',
			ExpressionAttributeValues: { ':nextCycle': nextCycle },
		})
		.promise()
}
