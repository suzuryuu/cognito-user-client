// Userの初ログインをイベントとして、そこでLambdaトリガーを実行する
// DynamoDBにemailとnicknameを保存しています
const AWS = require('aws-sdk');

const docClient = new AWS.DynamoDB.DocumentClient({
    region: "ap-northeast-1"
});

const tableName = "User"

exports.handler = async (event, context, callback) => {
  var params = {
    TableName: tableName,
    Item: {
      id: event.userName,
      email: event.request.userAttributes.email,
      nickname: event.request.userAttributes.nickname
    },
  };
  const result = await docClient.put(params).promise();
  console.log(
    `cognito user link to dynamodb id=${event.userName} email=${event.request.userAttributes.email} result=${result}`
  );

  callback(null, event);
};
