const AWS = require('aws-sdk')
const dynamo = new AWS.DynamoDB.DocumentClient({
	region: process.env.AWS_REGION,
	endpoint: process.env.DYNAMODB_ENDPOINT,
})

module.exports = dynamo
