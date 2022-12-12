import React from 'react'
import '../../App.css'
import { Link } from 'react-router-dom';
import SignOut from '../../page/auth/SignOut'
import Button from '@material-ui/core/Button'
import Grid from "@mui/material/Grid";
import { CognitoUserPool } from "amazon-cognito-identity-js"
import awsConfiguration from '../../conf/awsauth'
import apigatewayConf from '../../conf/apigateway'
import { useEffect } from 'react'
import axios from 'axios'
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

const MyRequestIndex = () => {
    var [JSONResultStr, setJSONStr] = React.useState('')
    const queryParam = '?suid=' + currentUserID;

    const API_ENDPOINT = apigatewayConf.END_POINT_URL
    const matchingRoute = '/dev/coaching/myreq'
    const requestUrl = API_ENDPOINT + matchingRoute + queryParam

    // ページのレンダでAPIリクエストを送る場合はuseEffectを使用する
    useEffect(() => {
        axios.get(requestUrl, {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': '*',
        }).then((res) => {
            setJSONStr(JSON.stringify(res.data))
            console.log(res.data)
            console.log("データ取得成功")
        }).catch((e) => {
            console.log(e)
        })
    }, [])

    const JSONparse = ()=>{
        var list = []
        // JSONResultStrは最初空なので空リストを返す
        if(JSONResultStr == ''){
            //console.log("current-json-value<string>:"+JSONResultStr)
            list = [""]
        }
        // 該当ユーザーが見つからない場合空のjson配列が返ってくるので
        else if(JSONResultStr == '[]'){
            list = ["あなたはまだリクエストを送っていないようです。"];
        }
        else{
            //console.log("current-json-value<string>:"+JSONResultStr)
            const json = JSON.parse(JSONResultStr)
            for(var i = 0; i < json.length; i++){
                const requestedID = json[i].requested_uid
                const status = json[i].reqStatus;

                //　状態分け
                var message = "";
                var link = ""
                if(status == "unconfirm"){
                    message = "未確認です。"
                }else if(status == "accept"){
                    message = "承認されました" 
                    link = <a href="">dmへ</a>
                }else if(status == "decline"){
                    message = "拒否されました。"
                }
                const idToQueryPath = "/matching/user?id=" + requestedID

                list.push(
                // listでDOM操作を仮で行ってますここをMUIで加工するといいかも
                <div><p>ユーザー(id表記):{requestedID}</p>
                <p>リクエストの確認状態:{message}{link}</p>
                <p><Link to={idToQueryPath}>プロフィールへ</Link></p>
                </div>
                )
            }
        }
        return list
    }
    return (
        <div><h2>あなたが送ったコーチングリクエストの一覧</h2>
        {JSONparse()}
        </div>)
}

export default MyRequestIndex