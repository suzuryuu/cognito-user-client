// idを使ってユーザーを取得するラムダ関数
const AWS = require('aws-sdk')
const docClient = new AWS.DynamoDB.DocumentClient({
    region: "ap-northeast-1"
})
// とりあえずセカンダリインデックスで同じ値を指定することでリクエストを送られたユーザーのソートをする
exports.handler = async(event, context) => {
    // cognito current user nameからとる
    //apiendpoint/resource?requid=hogehoge;
    var idFromAPIGateway = event.queryStringParameters.requid
    var params = {
        "TableName": 'CRequest',
        "IndexName": 'creqIndex', // グローバルセカンダリインデックス 自作の検索定義?的なもん
            
        "KeyConditionExpression": "#Prequest_uid = :Prequest_uid and #Srequest_uid = :Srequest_uid",//検索条件
        "ExpressionAttributeNames":{
            "#Prequest_uid": "Prequest_uid", // パーティションキーとソートキーの実際の名前
            "#Srequest_uid": "Srequest_uid",
        },
        "ExpressionAttributeValues": {
            ":Prequest_uid": idFromAPIGateway, // パーティションキーとソートキーの入力値
            ":Srequest_uid": idFromAPIGateway,
        }
    }
    
    var notifycount = 0;
    
    var matchedResult = await docClient.query(params, function(err, data){
        if(err){
            console.log('データー取得失敗')
            console.log(err)
        }else{
            var strJSON = JSON.stringify(data.Items)
            var parsedJSON = JSON.parse(strJSON)
            notifycount = parsedJSON.length
            console.log('リクエスト通知は' + notifycount + '件来てます。')
        }
    }).promise()
    
    
    // console.log("toplevel:" + notifycount)
    
    var items = "items"
    if(matchedResult != null){
        items = matchedResult.Items;
    }
     // レスポンスを設定する
    const response = {
        statusCode: 200,
        headers:{
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Allow-Origin': 'http://localhost:3000',
            'Access-Control-Allow-Methods': 'OPTIONS,POST,GET',
            'Access-Control-Allow-Credentials' : true
            
        },
        body: JSON.stringify(items),
    }
    // 戻り値を設定する
    return response
}