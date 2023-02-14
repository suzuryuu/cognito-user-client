const AWS = require('aws-sdk');

const docClient = new AWS.DynamoDB.DocumentClient({
    region: "ap-northeast-1"
});

const tableName = "ChatMessage"

exports.handler = async (event, context, callback) => {
    // event.bodyをパースして扱う
    const postedContext = JSON.parse(event.body)
    
    const now = new Date()
    
    const year = now.getFullYear();
    const month = now.getMonth()+1;
    const day = now.getDate();
    const hour = now.getHours();
    const min = now.getMinutes();
    const sec = now.getSeconds();

    const hourForJST = hour + 9

    const roomId = postedContext.room_id
    const createdAT = year + "-" + month + "-" + day + " " + hourForJST + ":" + min + ":" + sec
    const userId = postedContext.uid
    const nickName = postedContext.nickname
    const Message = postedContext.message
    
    var params = {
    TableName: tableName,
    Item: {
        room_id: roomId,
        created_at: createdAT,
        user_id: userId,
        nickname: nickName,
        message: Message
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
                "log" : "Successfully create chat message",
                "room_id" : roomId,
                "chatMessage": Message
            }
        ]),
    };
    return response;
};