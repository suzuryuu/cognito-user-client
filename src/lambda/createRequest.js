const AWS = require('aws-sdk');

const docClient = new AWS.DynamoDB.DocumentClient({
    region: "ap-northeast-1"
});

const tableName = "CRequest"

exports.handler = async (event, context, callback) => {
    // POST bodyから値取った時
    //event.body.hoge;
   var Prequested_uid = event.queryStringParameters.reqUID
   var s_uid = event.queryStringParameters.senderUID
   
   // var Prequested_uid = event.body[0].reqUID
    //var s_uid = event.body[0].senderUID
    // idをランダム文字列にする
    var S="abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
    var N=16
    var randomStr = Array.from(Array(N)).map(()=>S[Math.floor(Math.random()*S.length)]).join('')
    var params = {
    TableName: tableName,
    Item: {
        id: randomStr,
        requested_uid: Prequested_uid,
        sender_uid: s_uid,
        reqStatus: 'unconfirm',
        room_id: 'none'
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
                "requested_uid": Prequested_uid,
                "sender_uid": s_uid
            }
        ]),
    };
    return response;
};