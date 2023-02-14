// idを使ってユーザーを取得するラムダ関数
const AWS = require('aws-sdk')
const docClient = new AWS.DynamoDB.DocumentClient({
    region: "ap-northeast-1"
})

// ユーザー評価一覧取得ラムダ
exports.handler = async(event, context) => {
    
    var idFromAPIGateway = event.queryStringParameters.id;
   
    var params = {
            "TableName": 'FeedBack',
            "KeyConditionExpression": "#user_id = :user_id",//検索条件
            "ExpressionAttributeNames":{
                "#user_id": "user_id", // パーティションキーとソートキーの実際の名前
            },
            "ExpressionAttributeValues": {
                ":user_id": idFromAPIGateway, // パーティションキーとソートキーの入力値
            }
    }
    var matchedResult = await docClient.query(params, function(err, data){
        if(err){
            console.log('データー取得失敗')
            console.log(err)
        }else{
          console.log("データ取得成功")
        }
    }).promise()
    
    var items = "items"
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