
// TODO:自分のプロフィールはMyProfile.js的なものにする
import React from 'react'
import '../../App.css'
import { useLocation, useNavigate } from 'react-router-dom'
import apigatewatConf from '../../conf/apigateway'
import { useEffect } from 'react'

import axios from 'axios'
// S3とか使って好きなアイコン設定できるようにする？
import { useState } from "react";
import img from "../../style/user.jpg"
import Box from "@mui/material/Box"
import Grid from "@mui/material/Grid"
import ReactStars from "react-rating-stars-component"
import '../../style/matching.css'
import { Link } from 'react-router-dom'
import currentUser from '../common/getCurrentUser';
import { Button } from "@mui/material";


import { CognitoUserPool } from "amazon-cognito-identity-js"
import awsConfiguration from '../../conf/awsauth'


const userPool = new CognitoUserPool({
  UserPoolId: awsConfiguration.UserPoolId,
  ClientId: awsConfiguration.ClientId,
})


const signOut = () => {
  const cognitoUser = userPool.getCurrentUser()
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

/*星マークの受付*/
const ratingChanged = (newRating) => {}

// Box要素内はButtonのLink toが効かないのでonClickで遷移メソッドを呼ぶ
const onClickMoveToEdit = () =>{
  window.location.href = "/profile/edit"
}

const MyProfile = () => {


  var [JSONResultStr, setJSONStr] = React.useState('')

    /*プロフィール画像処理*/
  const [imagecrop, setimagecrop] = useState("");
  const [src] = useState(false);
  const [profile, setprofile] = useState([]);
  const [pview, setpview] = useState(false);
  const profileFinal = profile.map((item) => item.pview);

    
    const API_ENDPOINT = apigatewatConf.END_POINT_URL
    const matchingRoute = '/dev/users'
    const queryParam = '?userid=' + currentUser.ID;
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
        }).catch((e)=>{
            console.log(e)
        })
    }, [])
    
    /*
    編集処理
    const onClose = () => {
      setpview(null);
    };
  
    const onCrop = (view) => {
      setpview(view);
    };
  
    const saveCropImage = () => {
      if (pview != pview) {
        setprofile([...profile, { pview }]);
      } else {
        setimagecrop(false);
      }
    }*/

    var json = ""
    var nickname = ""
    var userID = ""
    var haveSkill = ""
    var wantSkill = ""
    var intro = ""
    if (JSONResultStr == '[]') {
        // 取得データが空の時
        nickname = "IDが該当するユーザー見つかりませんでした"
    }else if (!JSONResultStr == '') {
        json = JSON.parse(JSONResultStr)
        nickname = json[0].nickname
        userID = json[0].id
        haveSkill = json[0].haveSkill
        wantSkill = json[0].wantSkill
        intro = json[0].intro
    }
    
   
     

    return (
        <div className="normalUserProfile">
        
          {/*全体位置指定*/}
          <Grid
            container
            direction="column"
            justifyContent="center"
            alignItems="center"
          >
            <Grid>
              {/*画像サイズ指定　初期画像は{img}user.jpg*/}
              <img
            style={{
              width: "200px",
              height: "200px",
              borderRadius: "50%",
              objectFit: "cover",
            }}
            /*初期画像*/
            src={profileFinal.length ? profileFinal : pview}
            alt=""
          />
            </Grid>
    
            {/*マッチングしたユーザ名*/}
            <Grid><h2>{nickname}</h2></Grid>
            <Grid><p style={{ fontSize: 12,color: "gray"}}>ID:{userID}</p></Grid>
            {/*星マーク指定　星の数 星のサイズ*/}
            <Grid>
              平均評価
              <ReactStars
                count={5}
                onChange={ratingChanged}
                size={24}
                activeColor="#ffd700"
              />
              <label>実績: 件</label>
            </Grid>
    
            <Grid>
              <p>自己紹介:{intro}</p>
            </Grid>
            <Grid>
                <p>教えたいスキルがあるゲーム:{haveSkill}</p>
                <p>教わりたいスキルがあるゲーム:{wantSkill}</p>
            </Grid>
            {/*ボタンにLinktoを指定してもなぜか飛ばないので臨時でptag link to いれてる*/}
            <Grid container justifyContent={"center"} columnGap={2}>
              <Button
                variant="outlined"
                color="warning"
                style={{
                  width: "150px",
                  height: "50px",
                }}
                onClick={onClickMoveToEdit}
                /*label="編集する"
                href="/edit"*/
              >{<p>編集する</p>}</Button>
       
              <Button
                variant="contained"
                color="error"
                style={{
                  width: "150px",
                  height: "50px",
                }}
                onClick={signOut}
                /*label="編集する"
                href="/edit"*/
              >{<p>ログアウト</p>}</Button>
            </Grid>
        </Grid>
        
        </div>
        /* <div className="matcheduser">          
            <p>ユーザー名:{nickname}</p>
            <p>id: {userID}</p>
            <p>教えたいスキルがあるゲーム:{haveSkill}</p>
            <p>教わりたいスキルがあるゲーム:{wantSkill}</p>
            <a href='/matching'>戻る</a>
        </div> */
    )
}

export default MyProfile