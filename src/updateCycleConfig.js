const dynamo = require('./utils/dynamodbClient')

const CYCLE_CONFIG_TABLE = process.env.CYCLE_CONFIG_TABLE

exports.handler = async (event) => {
	try {
		const body = JSON.parse(event.body)
		const { region, currentCycle, cycleDuration } = body

		if (!region || !currentCycle || !cycleDuration) {
			return {
				statusCode: 400,
				body: JSON.stringify({
					error: 'region, currentCycle, and cycleDuration are required',
				}),
			}
		}

		// Update the cycle configuration in DynamoDB
		const params = {
			TableName: CYCLE_CONFIG_TABLE,
			Key: { region },
			UpdateExpression:
				'set currentCycle = :currentCycle, cycleDuration = :cycleDuration',
			ExpressionAttributeValues: {
				':currentCycle': currentCycle,
				':cycleDuration': cycleDuration,
			},
			ReturnValues: 'UPDATED_NEW',
		}

		const result = await dynamo.update(params).promise()

		return {
			statusCode: 200,
			body: JSON.stringify({
				message: 'Cycle config updated successfully',
				updatedConfig: result.Attributes,
			}),
		}
	} catch (error) {
		console.error('Error updating cycle config:', error)
		return {
			statusCode: 500,
			body: JSON.stringify({ error: 'Internal Server Error' }),
		}
	}
}
