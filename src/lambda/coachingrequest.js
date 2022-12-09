const AWS = require('aws-sdk');

const docClient = new AWS.DynamoDB.DocumentClient({
    region: "ap-northeast-1"
});

const tableName = "CRequest"

exports.handler = async (event, context, callback) => {
    // POST bodyから値取った時
    //event.body.hoge;
    var p_request_uid = "hogeId-02"
    var s_request_uid = "hogeId-02"
    var s_uid = "送り主FooBarID3"
    
    // idをランダム文字列にする
    var S="abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
    var N=16
    var randomStr = Array.from(Array(N)).map(()=>S[Math.floor(Math.random()*S.length)]).join('')
    var params = {
    TableName: tableName,
    Item: {
        id: randomStr,
        Prequest_uid: p_request_uid,
        Srequest_uid: s_request_uid,
        sender_uid: s_uid,
        reqStatus: 'unconfirm'
    },
  };
   const result = await docClient.put(params).promise();
   console.log(result);
    // TODO implement
    const response = {
        statusCode: 200,
        headers:{
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Allow-Origin': 'http://localhost:3000',
            'Access-Control-Allow-Methods': 'OPTIONS,POST,GET',
            'Access-Control-Allow-Credentials' : true
            
        },
        body: JSON.stringify([
            {
                "req_target_uid": p_request_uid,
                "sender_uid": s_uid
            }
        ]),
    };
    return response;
};