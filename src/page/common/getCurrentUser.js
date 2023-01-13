// 現在ログインしてるユーザーのidを取得する共通jsファイル
import awsConfiguration from "../../conf/awsauth";
import { CognitoUserPool } from "amazon-cognito-identity-js";

// 認証情報使用
const userPool = new CognitoUserPool({
    UserPoolId: awsConfiguration.UserPoolId,
    ClientId: awsConfiguration.ClientId,
})
const cognitoUser = userPool.getCurrentUser()
var currentUserID = 'User-ID-Value-From-Cognito' // 値を代入したいのでvarで定義

// 認証してる状態じゃないと取得できないので
if (cognitoUser != null) {
    currentUserID = cognitoUser.getUsername()
}


const currentUser = {
    ID: currentUserID,
}

export default currentUser;