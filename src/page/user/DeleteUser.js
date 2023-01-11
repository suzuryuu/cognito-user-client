import { Button, Grid } from "@mui/material"
import { Link } from 'react-router-dom'
import awsConfiguration from "../../conf/awsauth";
import apigatewayConf from "../../conf/apigateway";
import { CognitoUserPool } from "amazon-cognito-identity-js";
import { useEffect } from "react";
import axios from "axios";

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

const deleteFrom = async (awsService) => {
    const API_ENDPOINT = apigatewayConf.USER_END_POINT
    var route = ""
    // ほぼ処理が同じなので引数のサービス名でAPIルーティングを分ける
    if (awsService == "Cognito") {
        route = "/dev/user/destroy"
    } else if (awsService == "Dynamo") {
        route = "/dev/user/destroydb"
    }
    const query = "?userid=" + currentUserID
    const reqURL = API_ENDPOINT + route + query;
    try {
        // deleteは引数を三つ持てないので二つ目で指定する
        const response = await axios.delete(reqURL,
            {
                headers: {
                    'X-Api-Key': apigatewayConf.API_KEY,
                    'Content-Type': 'text/plain',
                }
            }
        );
        console.log("退会処理成功:" + response);
        // サインインしてるセッションは残っているので
        const cognitoUser = userPool.getCurrentUser()
        if (cognitoUser) {
            cognitoUser.signOut()
            // サインアウトしたらリロード
            window.location.href = "/"
            localStorage.clear()
            console.log('signed out')
            alert("退会完了: ご利用いただきありがとうございました。")
        } else {
            localStorage.clear()
            console.log('no user signing in')
        }
    } catch (error) {
        console.error(error)
        alert('リクエスト処理に失敗しました');
    }
}

const callAPIs = () => {
    deleteFrom("Dynamo")
    deleteFrom("Cognito")
  //  SignOut()
}
// 退会画面
const DeleteUsers = () => {
    return (
        <div className="deleteUser">
            <h2>本当に退会しますか？</h2>
            <p style={{ color: 'gray', fontSize: 13 }}>退会するとあなた({currentUserID})に関する情報はすべて削除されます。</p>
            <Grid container justifyContent={'center'} columnGap={3} style={{ paddingTop: 25 }}>
                <Button
                    variant="contained"
                    color="error"
                    style={{ height: 100, width: 180 }}
                    onClick={callAPIs}
                >はい
                </Button>
                <Button
                    variant="contained"
                    color="primary"
                    style={{ height: 100, width: 180 }}
                    component={Link}
                    to="/profile/edit"
                >いいえ
                </Button>
            </Grid>
        </div>
    )
}

export default DeleteUsers