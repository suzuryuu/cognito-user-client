// リクエストモデルのidをもとにリクエストstatusを書き換える関数
// 承認した場合はチャットroom idを発行する
const AWS = require('aws-sdk')
const docClient = new AWS.DynamoDB.DocumentClient({
    region: "ap-northeast-1"
})

exports.handler = async (event) => {
    // 来てるリクエスト一覧を取得するときにとれるモデルのPKを使う
    // post bodyでとる, request_statusのdefault値: unconfirm, 承諾: accept, 拒否: decline
    // リクエストモデルのパーディションキー
    var crequestPK = event.queryStringParameters.crPK
    var request_status = event.queryStringParameters.reqsts
    var S="abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
    // リクエストモデルのIDと被らないように文字数を変更
    var N=24
    var randomStrForRoomId = Array.from(Array(N)).map(()=>S[Math.floor(Math.random()*S.length)]).join('')
    
    var requestResultResponse = ""
    
    if(request_status == "accept"){
        requestResultResponse = "リクエストは承認に書き換わりました"
    }else if(request_status == "decline"){
        requestResultResponse = "リクエストは拒否に書き換わりました"
    }
    var params = {
        "TableName": "CRequest",
        "Key":{
            "id":crequestPK
        },
        "ExpressionAttributeValues": {
            ":update_status": request_status,
          //  ":update_roomid": randomStrForRoomId
        },
        "UpdateExpression" :"set reqStatus = :update_status",
        //"UpdateExpression" : "set room_id = :update_roomid",
        "ReturnValues" : "UPDATED_NEW"
    }
    
    const result = await docClient.update(params, function(err, data){
        if(err){
            console.log('データー更新失敗')
            console.log(err)
        }else{
            console.log("データ更新:dynamoDBを確認してください")
        }
    }).promise()
    
    console.log(result);
    
    var paramsForUpdateRoomId = {
        "TableName": "CRequest",
        "Key":{
            "id":crequestPK
        },
        "ExpressionAttributeValues": {
           ":update_roomid": randomStrForRoomId
        },
        "UpdateExpression" : "set room_id = :update_roomid",
        "ReturnValues" : "UPDATED_NEW"
    }
    
    
    
    const resultForUpdateRoomId = await docClient.update(paramsForUpdateRoomId, function(err, data){
        if(err){
            console.log('データー更新失敗')
            console.log(err)
        }else{
            console.log("データ更新:dynamoDBを確認してください")
        }
    }).promise()
    
    console.log(resultForUpdateRoomId);
    
    
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
                "log" : "書き換え成功",
                "req_result_response": requestResultResponse,
                "created_room_id" :randomStrForRoomId,
            }
        ])
    }
    return response;
};
