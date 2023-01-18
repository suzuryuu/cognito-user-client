import React from 'react'
import '../../App.css'
import '../../style/reqIndex.css'
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
                const chatRoomId = json[i].room_id

                // roomidが初期値の場合 chat?id=noneにアクセスしてチャットを投稿することを防ぐ
                if(chatRoomId == "none"){
                    chatRoomId = ""
                }
                const idToQueryPath = "/requests/user?id=" + sendersID + "&reqIdprm=" + reqPKprm
                const pathForChat = "/chat?id=" + chatRoomId;
                const requestStatus = json[i].reqStatus
                var message=  ""
                var dmLink = ""
                var linkToDetails = ""
                if(requestStatus == "unconfirm"){
                    message = "まだ確認していません。"
                    linkToDetails = <Link to={idToQueryPath}>詳細を確認する</Link>
                }
                else if(requestStatus == "accept"){
                    message = "承認しました。"
                    dmLink = <a href={pathForChat}>dmへ</a>
                }else if(requestStatus == "decline"){
                    message = "拒否しました。"
                }
                list.push(
                    <div>
                    <Grid item xs={12} className="reqIndex">
                    <p>リクエストを送信したユーザーID:{sendersID}</p>
                    <p>リクエストを{message}{dmLink}</p>
                    <p>{linkToDetails}</p>
                    </Grid>
                </div>
                )
            }
        }
        return list
    }
    return(
    <div><h2>リクエスト一覧</h2>
        <Grid container justifyContent={'center'} columnGap={5}  className='myreqUserContainer'>
            {JSONparse()}
        </Grid>
    </div>)
}

export default RequestIndex