let AWS = require('aws-sdk');
const ddb = new AWS.DynamoDB.DocumentClient();

// Get unix timestamp string and returns intl date "YYYY-MM-DD" string.
function parseQueryDate (dateString) {
    let date = new Date(parseInt(dateString));
	return date.toJSON().substr(0, 10);
}

exports.handler = function (event, context, callback) {
	var searchDate = parseDateString(event.queryStringParameters.date);
	let response = {
		body: "",
		statusCode: 200,
		isBase64Encoded: false
	}
	ddb.scan({
		TableName: 'contact_us',
		ExpressionAttributeValues: {
			':filterDate': searchDate
		},
		FilterExpression: 'entryDate = :filterDate'
	}, function (err, data) {
		if (err) {
			response.body = JSON.stringify(err);
			callback(response, null);
		} else {
			response.body = JSON.stringify(data);
			callback(null, response);
		}
	});
}

