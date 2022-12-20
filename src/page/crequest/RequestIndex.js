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

const RequestIndex = () => {
    var [JSONResultStr, setJSONStr] = React.useState('')
    const queryParam = '?requid=' + currentUserID

    const API_ENDPOINT = apigatewayConf.END_POINT_URL
    const matchingRoute = '/dev/coaching/notify'
    const requestUrl = API_ENDPOINT + matchingRoute + queryParam

    // ページのレンダ時でAPIリクエストを送る場合はuseEffectを使用する
    // ボタンを押してリクエストを送ったりする場合はtry catchでもいけるっぽい
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
            list = ["リクエストを送ってきたユーザーはまだいないようです。"];
        }
        else{
            //console.log("current-json-value<string>:"+JSONResultStr)
            const json = JSON.parse(JSONResultStr)
            for(var i = 0; i < json.length; i++){
                const sendersID = json[i].sender_uid
                // リクエストモデルのid
                const reqPKprm = json[i].id
                const idToQueryPath = "/requests/user?id=" + sendersID + "&reqIdprm=" + reqPKprm
                const requestStatus = json[i].reqStatus
                var message=  ""
                var dmLink = ""
                if(requestStatus == "unconfirm"){
                    message = "まだ確認していません。"
                }
                else if(requestStatus == "accept"){
                    message = "承認しました。"
                    dmLink = <a href="/">dmへ</a>
                }else if(requestStatus == "decline"){
                    message = "拒否しました。"
                }
                list.push(
                // listでDOM操作を仮で行ってますここをMUIで加工するといいかも
                <div>リクエストを送信したユーザー(id表記):{sendersID}
                <p>リクエストを{message}{dmLink}</p>
                <p><Link to={idToQueryPath}>詳細を確認する</Link></p>
                </div>
                )
            }
        }
        return list
    }
    return(
    <div><h2>リクエスト一覧</h2>
        {JSONparse()}
    </div>)
}

export default RequestIndex