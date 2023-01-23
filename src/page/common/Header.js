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

import { CognitoUserPool } from "amazon-cognito-identity-js"
import awsConfiguration from '../../conf/awsauth'

// 認証情報使用
const userPool = new CognitoUserPool({
  UserPoolId: awsConfiguration.UserPoolId,
  ClientId: awsConfiguration.ClientId,
})
const cognitoUser = userPool.getCurrentUser()

const signOut = () => {
  if (cognitoUser) {
    cognitoUser.signOut()
    // サインアウトしたらリロード
    window.location.href = "/"
    localStorage.clear()
    console.log('signed out')
  } else {
    localStorage.clear()
    console.log('no user signing in')
  }
}


export default function MenuAppBar() {
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
    <AppBar position="static">
      <Toolbar>
        {/*ホームボタン　aタグにリンク*/}
        <Grid container sx={{ flexGrow: 1 }}>
          <a href="/">
            <IconButton>
              <HomeIcon sx={{ fontSize: 49 }} color="black" />
            </IconButton>
          </a>
        </Grid>

        {auth && (
          <div>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenu}
              color="inherit">
              <Grid container sx={{ flexGrow: 1 }}>
                <AccountCircle sx={{ fontSize: 49 }} color="black" />
                {/* こういうことやりたいけど動かない
           画像サイズ指定　初期画像は{img}user.jpg
           <img
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              objectFit: "cover",
            }}
            /*初期画像
            src={profileFinal.length ? profileFinal : pview}
            alt=""
          />*/}
              </Grid>
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={handleClose}>
                <a /*href={currentUserProfileLinkPath} target={"_blank"}*/>
                  <Link to={'/profile'}>Profile</Link>
                </a>
              </MenuItem>
              <MenuItem onClick={handleClose}>
                <a href="#" onClick={signOut}>
                  Logout
                </a>
              </MenuItem>
            </Menu>
          </div>
        )}
      </Toolbar>
    </AppBar>
  </Box>);
}