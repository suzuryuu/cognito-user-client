// idを使ってユーザーを取得するラムダ関数
const AWS = require('aws-sdk')
const docClient = new AWS.DynamoDB.DocumentClient({
    region: "ap-northeast-1"
})


exports.handler = async(event, context) => {
    
    var idFromAPIGateway = event.queryStringParameters.roomid;
   
    var params = {
            "TableName": 'ChatMessage',
            "KeyConditionExpression": "#room_id = :room_id",//検索条件
            "ExpressionAttributeNames":{
                "#room_id": "room_id", // パーティションキーとソートキーの実際の名前
            },
            "ExpressionAttributeValues": {
                ":room_id": idFromAPIGateway, // パーティションキーとソートキーの入力値
            }
    }
    
    var matchedResult = await docClient.query(params, function(err, data){
        if(err){
            console.log('データー取得失敗')
            console.log(err)
        }else{
            console.log('データ取得成功')
        }
    }).promise()
 
    var items;
    if(matchedResult != null){
        items = matchedResult.Items;
    }
     // レスポンスを設定する
    const response = {
        statusCode: 200,
        headers:{
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'OPTIONS,POST,GET',
            'Access-Control-Allow-Credentials' : true
            
        },
        body: JSON.stringify(items),
    }
    // 戻り値を設定する
    return response
}