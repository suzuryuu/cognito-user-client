import React from "react";
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
var currentUserID = 'User-ID-Value-From-Cognito' // 値を代入したいのでvarで定義

// 認証してる状態じゃないと取得できないので
if(cognitoUser != null){
    currentUserID = cognitoUser.getUsername()
}

// UserProfileへのパス
const currentUserProfileLinkPath = "/profile?id=" + currentUserID

const signOut = () => {
  if (cognitoUser) {
    cognitoUser.signOut()
    // サインアウトしたらリロード
    window.location.href="/"
    localStorage.clear()
    console.log('signed out')
  } else {
    localStorage.clear()
    console.log('no user signing in')
  }
}

export default function MenuAppBar() {
  const [auth, setAuth] = React.useState(true);
  const [anchorEl, setAnchorEl] = React.useState(null);
  
  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  /*検索バー　プロフィールアイコン */
  // 検索ボタンとホームに戻るリンクがほしい->任せる
  return (     <Box sx={{ flexGrow: 1 }}>
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
                  <Link to={currentUserProfileLinkPath}>Profile</Link>
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