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
      <IconButton
          size="large"
          aria-label="account of current user"
          aria-controls="menu-appbar"
          aria-haspopup="true"
          >
          <AccountCircle sx={{ fontSize: 50, paddingTop: 3}}/>
        </IconButton>
      </a>
      </Grid>
    </AppBar>
  </Box>);
}