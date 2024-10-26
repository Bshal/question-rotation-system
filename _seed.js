const AWS = require('aws-sdk')

// Configure AWS SDK to connect to the local DynamoDB instance
AWS.config.update({
	region: 'ap-south-1',
	endpoint: 'http://localhost:8000',
})

const dynamo = new AWS.DynamoDB.DocumentClient()

// Sample questions data to seed into DynamoDB
const questionData = [
	{
		region: 'Singapore',
		questionId: 1,
		cycle: 1,
		questionText: 'What is the capital of Singapore?',
	},
	{
		region: 'Singapore',
		questionId: 2,
		cycle: 2,
		questionText: 'What is the population of Singapore?',
	},
	{
		region: 'Singapore',
		questionId: 3,
		cycle: 3,
		questionText: 'What is the official language of Singapore?',
	},
	{
		region: 'Singapore',
		questionId: 4,
		cycle: 4,
		questionText: 'Who is the current Prime Minister of Singapore?',
	},
	{
		region: 'Singapore',
		questionId: 5,
		cycle: 5,
		questionText: 'Which sea is Singapore located on?',
	},
	{
		region: 'US',
		questionId: 1,
		cycle: 1,
		questionText: 'What is the capital of the US?',
	},
	{
		region: 'US',
		questionId: 2,
		cycle: 2,
		questionText: 'What is the largest state in the US?',
	},
	{
		region: 'US',
		questionId: 3,
		cycle: 3,
		questionText: 'Who is the President of the United States?',
	},
	{
		region: 'US',
		questionId: 4,
		cycle: 4,
		questionText: 'What is the official currency of the United States?',
	},
	{
		region: 'US',
		questionId: 5,
		cycle: 5,
		questionText: 'How many states are in the United States?',
	},
]

// Sample cycle config data to seed into DynamoDB
const cycleConfigData = [
	{
		region: 'Singapore',
		currentCycle: 1,
		cycleDuration: 7,
		nextRotationTime: '2024-10-30T19:00:00Z',
	},
	{
		region: 'US',
		currentCycle: 1,
		cycleDuration: 7,
		nextRotationTime: '2024-10-30T19:00:00Z',
	},
]

// Function to seed questions into DynamoDB
const seedQuestions = async () => {
	console.log('Seeding questions...')
	for (const question of questionData) {
		const params = {
			TableName: 'question-rotation-system-questions',
			Item: {
				'region#questionId': `${question.region}#${question.questionId}`,
				cycle: question.cycle,
				questionText: question.questionText,
			},
		}

		try {
			await dynamo.put(params).promise()
			console.log(`Seeded question: ${question.questionText}`)
		} catch (error) {
			console.error('Error seeding question:', error)
		}
	}
}

// Function to seed cycle config into DynamoDB
const seedCycleConfig = async () => {
	console.log('Seeding cycle configurations...')
	for (const config of cycleConfigData) {
		const params = {
			TableName: 'question-rotation-system-cycle-config',
			Item: {
				region: config.region,
				currentCycle: config.currentCycle,
				cycleDuration: config.cycleDuration,
				nextRotationTime: config.nextRotationTime,
			},
		}

		try {
			await dynamo.put(params).promise()
			console.log(`Seeded cycle config for region: ${config.region}`)
		} catch (error) {
			console.error('Error seeding cycle config:', error)
		}
	}
}

// Main function to execute the seeding process
const seedDatabase = async () => {
	await seedQuestions()
	await seedCycleConfig()
	console.log('Database seeding complete.')
}

// Export the function so it can be used as a Lambda function if needed
module.exports.seedDatabase = seedDatabase

// Automatically run the seed function if the script is executed directly
if (require.main === module) {
	seedDatabase()
}
