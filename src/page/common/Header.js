import React from "react";

import { useEffect, useState } from "react";
import axios from "axios";
import currentUser from "./getCurrentUser";
import apigatewayConf from "../../conf/apigateway";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import AccountCircle from "@mui/icons-material/AccountCircle";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import HomeIcon from "@mui/icons-material/Home";
import Grid from "@mui/material/Grid";
import { Link } from 'react-router-dom';
import { Button } from "@mui/material";

import { CognitoUserPool } from "amazon-cognito-identity-js"
import awsConfiguration from '../../conf/awsauth'

import "../../style/header.css";
import { padding } from "@mui/system";

// MUIのアイコン
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import SendIcon from '@mui/icons-material/Send';
import PendingIcon from '@mui/icons-material/Pending';
import { Search } from "@mui/icons-material";
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';




// 認証情報使用
const userPool = new CognitoUserPool({
  UserPoolId: awsConfiguration.UserPoolId,
  ClientId: awsConfiguration.ClientId,
})
const cognitoUser = userPool.getCurrentUser()

var currentUserID = 'User-ID-Value-From-Cognito' // 値を代入したいのでvarで定義
// 認証してる状態じゃないと取得できないので
if (cognitoUser != null) {
    currentUserID = cognitoUser.getUsername() //認証要素をemailにして名前をnicknameでとってるからidがここにある
} 


export default function MenuAppBar() {

  /*プロフィール画像処理*/
  const [pview, setpview] = useState(false);


  const API_ENDPOINT = apigatewayConf.END_POINT_URL
  const matchingRoute = '/dev/users'
  const queryParam = "?userid="+currentUserID;
  const requestUrl = API_ENDPOINT + matchingRoute + queryParam

  // ページのレンダでAPIリクエストを送る場合はuseEffectを使用する

  useEffect(() => {
      axios.get(requestUrl, {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': '*',
      }).then((res) => {
        // console.log("画像データ"+ res.data[0].picture)
        setpview(
          res.data[0].picture
        )
        console.log(res)
        console.log("データ取得成功")
      }).catch((e)=>{
          // 基本問題ないのになぜかエラー起きる(APIリクエストを送るのが非同期だから)
          // alert('データ取得エラー')
      })
  }, [])

  /*検索バー　プロフィールアイコン */
  // 検索ボタンとホームに戻るリンクがほしい->任せる
  return (<Box sx={{ flexGrow: 1 }}>
    <AppBar position="static" 
    style={{ 
      backgroundColor: "#f78b60", 
      height: 120, 
      display: "flex"  
    }} className="headerContent">
      <Grid container justifyContent={"left"}  style={{}}columnGap={5} className="functions">
        <a href="/" className="titleHref"><SportsEsportsIcon></SportsEsportsIcon>Mu-Tech</a>
        <a href="/profile">
        <img
              style={{
                width: "60px",
                height: "60px",
                borderRadius: "50%",
                objectFit: "cover",
                marginTop: 30,
              }}
              /*プロフィール画像*/
              src={pview}
            />
      </a>
      </Grid>
    </AppBar>
  </Box>);
}