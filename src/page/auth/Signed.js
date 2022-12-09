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

  var json = ""
  var notifycount = 0;
  if (!JSONResultStr == '') {
    json = JSON.parse(JSONResultStr)
    notifycount = json.length
  }

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
          <a href="/requests">リクエスト一覧へ</a>
    </div>
  )
}

export default Signed