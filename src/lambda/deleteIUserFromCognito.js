
const AWS = require('aws-sdk')
const docClient = new AWS.DynamoDB.DocumentClient({
    region: "ap-northeast-1"
})

let aws = require("aws-sdk");

exports.handler = async (event) => {

    // eventから削除するCognitoユーザーのユーザー名リストを受け取る
    // url?userid=aaaaa
    let userid = event.queryStringParameters.userid

    // Cognitoユーザーの無効化メソッドをコール
    await disalbeCognito(userid);

    const response = {
        statusCode: 200,
          headers:{
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'DELETE',
            'Access-Control-Allow-Credentials' : 'true'
        },
        body:JSON.stringify([{
            "deleted_id": userid
        }])
    };
    return response;
};

//Cognito情報を無効

async function disalbeCognito(userid){

        // Cognitoを使う準備
        aws.config.update({
            region: 'ap-northeast-1',
        });
        const cognito = new aws.CognitoIdentityServiceProvider({
            apiVersion: '2016-04-18'
        });
        // 対象のCognitoユーザープールID
        const user_pool_id = "ap-northeast-1_8AEd5BkL9";
        
            // ユーザー削除
            try {
                await cognito.adminDeleteUser({
                    UserPoolId: user_pool_id,
                    Username: userid
                }).promise();
                console.log("Success! userName : " + userid);
            } catch (err) {
                console.log("Failed! userName : " + userid);
                if (err.code == 'UserNotFoundException') {
                    // ユーザープールにユーザーが存在していない場合
                    console.log('UserNotFoundException');
                } else {
                    // その他のエラー
                    console.log(err, err.stack);
                }
                throw err;
            }
        
    }