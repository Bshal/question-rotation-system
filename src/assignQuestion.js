const dynamo = require('./utils/dynamodbClient')

exports.handler = async (event) => {
	const region = event.queryStringParameters.region

	if (!region) {
		return {
			statusCode: 400,
			body: JSON.stringify({ error: 'Region is required' }),
		}
	}

	try {
		// Fetch the current cycle for the region from the CycleConfigTable
		const cycleConfig = await dynamo
			.get({
				TableName: process.env.CYCLE_CONFIG_TABLE,
				Key: { region },
			})
			.promise()

		if (!cycleConfig.Item) {
			return {
				statusCode: 404,
				body: JSON.stringify({
					error: 'Cycle configuration not found for the region',
				}),
			}
		}

		const currentCycle = cycleConfig.Item.currentCycle
		console.log('--------currentCycle:', currentCycle)
		console.log(`${region}#${currentCycle}`)

		// Now query the QuestionsTable for the question for this region and cycle
		const result = await dynamo
			.get({
				TableName: process.env.QUESTIONS_TABLE,
				Key: {
					'region#questionId': `${region}#${currentCycle}`, // Composite key
				},
			})
			.promise()

		if (!result.Item) {
			return {
				statusCode: 404,
				body: JSON.stringify({
					error: 'Question not found for the current cycle',
				}),
			}
		}

		return {
			statusCode: 200,
			body: JSON.stringify({ question: result.Item }),
		}
	} catch (error) {
		console.error('Error fetching question:', error)
		return {
			statusCode: 500,
			body: JSON.stringify({ error: 'Internal Server Error' }),
		}
	}
}
