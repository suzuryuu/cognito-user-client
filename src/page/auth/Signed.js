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
if(cognitoUser != null){
  currentUserID = cognitoUser.getUsername()
}

const Signed = () => {
  // 通知のためのjsonの入れ物
  var jsonForNotifyCount = ""
  // 承認されたリクエストをカウントするためのjsonの入れ物
  var jsonForAcceptedCount = ""
  
  // 自分が送ったリクエストのカウント
  var requestedYourSelfCount = 0;
  // 自分が送ったリクエストの中で承認されたもののカウント
  var acceptedCount = 0;
  // リクエストがいくつ届いてるかカウント
  var notifycount = 0;


  // 処理の重複記述が多いので後でリファクタリングする
  const useNotifyCount = () =>{
    var [JSONResultStr, setJSONStr] = React.useState('')
    const queryParam = '?requid=' + currentUserID;
  
    const API_ENDPOINT = apigatewayConf.END_POINT_URL
    const matchingRoute = '/dev/coaching/notify'
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
        }).catch((e)=>{
            console.log(e)
        })
    }, [])

    if (!JSONResultStr == '') {
      jsonForNotifyCount = JSON.parse(JSONResultStr)
      notifycount = jsonForNotifyCount.length
    }
  }

  const useAcceptedCount = () =>{
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
        }).catch((e)=>{
            console.log(e)
        })
    }, [])

    if (!JSONResultStr == '') {
      jsonForAcceptedCount = JSON.parse(JSONResultStr)
      requestedYourSelfCount = jsonForAcceptedCount.length;
      for(var i = 0; i < jsonForAcceptedCount.length; i++){
        if(jsonForAcceptedCount[i].reqStatus == "accept"){
          acceptedCount++;
        }
      }
    }
  }

  useNotifyCount()
  useAcceptedCount()

  return (
    <div className="authorizedMode">
          <h1>Home</h1>
          <Grid container justifyContent={'center'} columnGap={3}>
          <Button
           variant="contained"
           color="primary"
           style={{height: 100, width: 250}}
           component={Link}
           to="/matching"
           >マッチするユーザーを探す
           </Button>
           <SignOut />
          </Grid>

          <h2>あなたに{notifycount}件のコーチングリクエストが届きました。</h2>
          <h2>あなたの送った{requestedYourSelfCount}件のリクエストのうち{acceptedCount}件が承認されています。</h2>
          <a href="/requests">リクエスト一覧へ</a><br></br>
          <a href="/requests/yourself">あなたが送ったリクエストの一覧</a>
    </div>
  )
}
export default Signed