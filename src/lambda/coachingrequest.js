const AWS = require('aws-sdk');

const docClient = new AWS.DynamoDB.DocumentClient({
    region: "ap-northeast-1"
});

const tableName = "CoachingRequest"

// dynamoDBのコーチングテーブルにデータを送る
exports.handler = async (event, context, callback) => {
    var requestUserId = 'hogeId';
    var myUserId = 'FooId';
    
    var params = {
    TableName: tableName,
    Item: {
      request_user_id: requestUserId,
      myuser_id: myUserId,
      status: 'unconfirm'
    },
  };
   const result = await docClient.put(params).promise();
   console.log(result);
    // TODO implement
    const response = {
        statusCode: 200,
        body: JSON.stringify('Successfully Send CoachingRequest to Table'),
    };
    callback(null, event);
    return response;
};