const AWS = require('aws-sdk');

const docClient = new AWS.DynamoDB.DocumentClient({
    region: "ap-northeast-1"
});

const tableName = "FeedBack"

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

    // GMTより9時間進んでるので
    const hourForJST = hour + 9


    // 評価される人のuserid
    const userId= postedContext.userid
    
    // 評価する人のuserid
    const fdbuserId = postedContext.fuid
    
    // 評価する人のnickname
    const nickName =  postedContext.nickname
    
    // 評価する人のicon
    const picture = postedContext.picture
    
    // 評価文
    const content = postedContext.content
    
    // 星評価
    const star = postedContext.star
    
    // 作成日時
    const createdAT = year + "-" + month + "-" + day + " " + hourForJST + ":" + min + ":" + sec
    
    var params = {
    TableName: tableName,
    Item: {
        user_id: userId,
        fdb_user_id: fdbuserId,
        fdb_nickname: nickName,
        picture: picture,
        content: content,
        star: star,
        created_at: createdAT
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
                "log" : "Successfully create feedback",
                "user_id" : userId,
                "feedback_user_id":fdbuserId,
                "content": content,
                "star": star,
                "created_at": createdAT
                
            }
        ]),
    };
    return response;
};
