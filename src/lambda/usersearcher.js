const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient({
    region: "ap-northeast-1"
});

exports.handler = async(event, context) => {
   // APIGateWayからクエリを受け取る方法 プロキシ統合版のメソッドじゃないとダメみたい
   // 教わりたいスキル
   var wantSkill = event.queryStringParameters.wskill;
   // 教えたいスキル
   var haveSkill = event.queryStringParameters.hskill;
   
   console.log("自分が教わりたいスキル:" + wantSkill)
   console.log("自分が教えたいスキル" + haveSkill)
   var params = {
        "TableName": 'User',
        "IndexName": 'skillMatchingIndex', // グローバルセカンダリインデックス 自作の検索定義?的なもん
            
        "KeyConditionExpression": "#haveSkill = :haveSkill and #wantSkill = :wantSkill",//検索条件
        "ExpressionAttributeNames":{
            "#haveSkill": "haveSkill", // パーティションキーとソートキーの実際の名前
            "#wantSkill": "wantSkill",
        },
        "ExpressionAttributeValues": {
            ":haveSkill": wantSkill, // パーティションキーとソートキーの入力値
            ":wantSkill": haveSkill,
        }
    };
    var matchedResult = await docClient.query(params, function(err, data){
        if(err){
            console.log('データー取得失敗')
            console.log(err);
        }else{
            data.Items.forEach(function(user, index){
               // console.log("MatchedUserID:" +user.id)
                console.log("マッチしたユーザー:" +user.nickname);
                console.log("ユーザーが教えたいもの:" + user.haveSkill)
                console.log("ユーザーが教わりたいもの:" + user.wantSkill)
            });
        }
    }).promise();
    
    var items = "items";
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
    };
    // 戻り値を設定する
    return response;
};
