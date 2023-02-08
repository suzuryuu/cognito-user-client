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



export default function MenuAppBar() {

  var jsonForNotifyCount = ""
  // 承認されたリクエストをカウントするためのjsonの入れ物
  var jsonForAcceptedCount = ""

  // 保留ユーザーのカウントのためのjsonのいれもの
  var jsonForPendingCount = ""
  // 自分が送ったリクエストのカウント
  var requestedYourSelfCount = 0;
  // 自分が送ったリクエストの中で承認されたもののカウント
  var acceptedCount = 0;
  // リクエストがいくつ届いてるかカウント
  var notifycount = 0;
  // リクエストを送ろうか保留しているユーザー数のカウント
  var pendingUserCount = 0;

  // 共通で使うリクエストURLで使う変数
  var query = ""
  var route = ""


  const useCountFor = (value) => {
    var [JSONResultStr, setJSONStr] = React.useState('')
    const API_ENDPOINT = apigatewayConf.END_POINT_URL
    query = '?userid=' + currentUser.ID
    route = '/dev/coaching/getpending'

    const requestUrl = API_ENDPOINT + route + query
    // ページのレンダでAPIリクエストを送る場合はuseEffectを使用する
    useEffect(() => {
      axios.get(requestUrl,
        {
          headers: {
            'Content-Type': 'text/plain',
            'X-Api-Key': apigatewayConf.API_KEY,
            //  'Access-Control-Allow-Origin' : 'http://localhost:3000'
          }
        },
      ).then((res) => {
        setJSONStr(JSON.stringify(res.data))
        console.log(res.data)
        console.log("データ取得成功")
      }).catch((e) => {
        console.log(e)
      })
    }, [])
    if (!JSONResultStr == '') {
      jsonForPendingCount = JSON.parse(JSONResultStr)
      pendingUserCount = jsonForPendingCount.length;
    }
  }

  // 処理の重複記述が多いので後でリファクタリングする
  const useNotifyCount = () => {
    var [JSONResultStr, setJSONStr] = React.useState('')
    const queryParam = '?requid=' + currentUser.ID;

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
      }).catch((e) => {
        console.log(e)
      })
    }, [])

    if (!JSONResultStr == '') {
      jsonForNotifyCount = JSON.parse(JSONResultStr)
      notifycount = jsonForNotifyCount.length
    }
  }

  const useAcceptedCount = () => {
    var [JSONResultStr, setJSONStr] = React.useState('')
    const queryParam = '?suid=' + currentUser.ID;

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

    if (!JSONResultStr == '') {
      jsonForAcceptedCount = JSON.parse(JSONResultStr)
      requestedYourSelfCount = jsonForAcceptedCount.length;
      for (var i = 0; i < jsonForAcceptedCount.length; i++) {
        if (jsonForAcceptedCount[i].reqStatus == "accept") {
          acceptedCount++;
        }
      }
    }
  }


  useNotifyCount()
  useAcceptedCount()
  useCountFor("pending")



  var [JSONResultStr, setJSONStr] = React.useState('')


  /*プロフィール画像処理*/
  const [imagecrop, setimagecrop] = useState("");
  const [src] = useState(false);
  const [profile, setprofile] = useState([]);
  const [pview, setpview] = useState(false);
  const profileFinal = profile.map((item) => item.pview);

  const [auth, setAuth] = React.useState(true);
  const [anchorEl, setAnchorEl] = React.useState(null);

  const useUserInfo = async (useridType) => {
    const API_ENDPOINT = apigatewayConf.END_POINT_URL
    const matchingRoute = '/dev/users'
    const queryParam = '?userid=' + currentUser.ID
    const requestUrl = API_ENDPOINT + matchingRoute + queryParam

    // ページのレンダでAPIリクエストを送る場合はuseEffectを使用する
    useEffect(() => {
      axios.get(requestUrl, {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': '*',
      }).then((res) => {
        setJSONStr(JSON.stringify(res.data))
        console.log(res.data)
        setpview(
          res.data[0].picture
        )
        console.log("データ取得成功")
      }).catch((e) => {
        console.log(e)
      })
    }, [])
  }

  // current userの情報を取る
  useUserInfo("current")


  // レスポンスで使うデータ
  var json = ""
  var nickname = ""
  var userID = ""
  /*var haveSkill = ""
  var wantSkill = ""
  var intro = ""*/
  if (JSONResultStr == '[]') {
    // 取得データが空の時
    nickname = "IDが該当するユーザー見つかりませんでした"
  } else if (!JSONResultStr == '') {
    json = JSON.parse(JSONResultStr)
    nickname = json[0].nickname
    userID = json[0].id
    /*haveSkill = json[0].haveSkill
    wantSkill = json[0].wantSkill
    intro = json[0].intro*/
  }
  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  /*検索バー　プロフィールアイコン */
  // 検索ボタンとホームに戻るリンクがほしい->任せる
  return (<Box sx={{ flexGrow: 1 }}>
    <AppBar position="static" style={{ backgroundColor: "#f78b60", height: 120, display: "flex" }}>
      <Grid container justifyContent={"center"}  style={{}}columnGap={5} className="functions">
        <a href="/" className="titleHref"><SportsEsportsIcon></SportsEsportsIcon>Mu-Tech</a>
        <Button
          variant="contained"
          color="warning"
          style={{ height: 50, width: 200, marginTop: 30 }}
          component={Link}
          to="/matching"
        ><Search></Search></Button>
        <Button
          variant="contained"
          color="warning"
          style={{ height: 50, width: 200, marginTop: 30 }}
          component={Link}
          to="/requests"
        ><NotificationsActiveIcon></NotificationsActiveIcon>(<p style={{ color: 'yellow' }}>{notifycount}</p>)</Button>
        <Button
          variant="contained"
          color="warning"
          style={{ height: 50, width: 200, marginTop: 30 }}
          component={Link}
          to="/requests/yourself"
        ><SendIcon></SendIcon>(承認:<p style={{ color: 'yellow' }}>{acceptedCount}</p>/<p style={{ color: 'white' }}>{requestedYourSelfCount}</p>)</Button>
        <Button
          variant="contained"
          color="warning"
          style={{ height: 50, width: 200, marginTop: 30 }}
          component={Link}
          to="/requests/pending"
        ><PendingIcon></PendingIcon>保留したユーザー(<p>{pendingUserCount}</p>)</Button>
        <div className="usercontent" style={{}}>
      
          <a href="/profile">
          <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              >
              <AccountCircle sx={{ fontSize: 50,paddingTop: 3 }}/>
            
            </IconButton>
          </a>
         </div> 
      </Grid>


    </AppBar>
  </Box>);
}