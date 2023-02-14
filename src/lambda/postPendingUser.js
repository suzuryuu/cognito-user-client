const AWS = require('aws-sdk');

const docClient = new AWS.DynamoDB.DocumentClient({
    region: "ap-northeast-1"
});

const tableName = "PendingUser"

exports.handler = async (event, context, callback) => {
    // POST bodyから値取った時
    //event.body.hoge;
   const Uid = event.queryStringParameters.uid;
   const pendingUid = event.queryStringParameters.puid;
   
   var S="abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
   var N=16
   var randomStr = Array.from(Array(N)).map(()=>S[Math.floor(Math.random()*S.length)]).join('')
   
   var params = {
    TableName: tableName,
    Item: {
         id: randomStr,
         uid:Uid,
         pendinguid: pendingUid,
    },
  };
   const result = await docClient.put(params).promise();
   console.log(result);
    // TODO implement
    const response = {
        statusCode: 200,
        headers:{
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'OPTIONS,POST',
            'Access-Control-Allow-Credentials' : 'true'
            
        },
        body: JSON.stringify([
            {
                "pending_target_uid": Uid,
                "your_id": pendingUid
            }
        ]),
    };
    return response;
};