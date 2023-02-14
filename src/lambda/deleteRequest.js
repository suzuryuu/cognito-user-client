// idを使ってユーザーを取得するラムダ関数
const AWS = require('aws-sdk')
const docClient = new AWS.DynamoDB.DocumentClient({
    region: "ap-northeast-1"
})

exports.handler = async(event, context) => {
    
    var idFromAPIGateway = event.queryStringParameters.crPK;
    

    var params = {
        "TableName": 'CRequest',
        "Key":{
            "id": idFromAPIGateway
        },
    }
    await docClient.delete(params, function(err, data){
        if(err){
            console.log('削除失敗')
            console.log(err)
        }else{
            console.log("削除成功")
        }
    }).promise()
     // レスポンスを設定する
    const response = {
        statusCode: 200,
        headers:{
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'DELETE',
            'Access-Control-Allow-Credentials' :'true'
        },
        body: JSON.stringify([{
            "deleted_from_dynamo" : idFromAPIGateway
        }]),
    }
    // 戻り値を設定する
    return response
}