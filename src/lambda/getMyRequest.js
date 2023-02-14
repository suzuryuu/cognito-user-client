// リクエストの送り主 == current userの一覧を返す
const AWS = require('aws-sdk')
const docClient = new AWS.DynamoDB.DocumentClient({
    region: "ap-northeast-1"
})
// とりあえずセカンダリインデックスで同じ値を指定することでリクエストを送られたユーザーのソートをする
exports.handler = async(event, context) => {
    // cognito current user nameからとる
    //apiendpoint/resource?suid=hogehoge;
    var senderUIDFromAPIGateway = event.queryStringParameters.suid
    //var senderUIDFromAPIGateway = "送り主FooBarID"
    
    var params = {
        "TableName": 'CRequest',
        "IndexName": 'senderIndex', // グローバルセカンダリインデックス 自作の検索定義?的なもん
            
        "KeyConditionExpression": "#sender_uid = :sender_uid",//検索条件
        "ExpressionAttributeNames":{
            "#sender_uid": "sender_uid", // パーティションキーとソートキーの実際の名前
        },
        "ExpressionAttributeValues": {
            ":sender_uid": senderUIDFromAPIGateway, // パーティションキーとソートキーの入力値
        }
    }
    
    var matchedResult = await docClient.query(params, function(err, data){
        if(err){
            console.log('データー取得失敗')
            console.log(err)
        }else{
            console.log(data.Items)
            console.log('このユーザーがリクエストを送った回数:' + data.Items.length)
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