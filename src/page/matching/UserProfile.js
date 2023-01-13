
// TODO:自分のプロフィールはMyProfile.js的なものにする
import React from 'react'
import '../../App.css'
import { useLocation, useNavigate } from 'react-router-dom'
import apigatewayConf from '../../conf/apigateway'
import { useEffect } from 'react'

import axios from 'axios'
import { paste } from '@testing-library/user-event/dist/paste'

import { CognitoUserPool } from "amazon-cognito-identity-js"
import awsConfiguration from '../../conf/awsauth'
import { ConstructionOutlined } from '@mui/icons-material'

import { Button } from "primereact/button";
// S3とか使って好きなアイコン設定できるようにする？
import img from "../../style/user.jpg";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import ReactStars from "react-rating-stars-component";
import '../../style/matching.css'
import currentUser from '../common/getCurrentUser'


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


/*星マークの受付*/
const ratingChanged = (newRating) => {};

const UserProfile = () => {
    var [JSONResultStr, setJSONStr] = React.useState('')

    const search = useLocation().search
    const query = new URLSearchParams(search)
    const id = query.get('id')
    const queryParam = '?userid=' + id;

    const API_ENDPOINT = apigatewayConf.END_POINT_URL
    const matchingRoute = '/dev/users'
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
            alert('マッチングの為の入力が不十分です。')
        })
    }, [])

    var json = ""
    var nickname = ""
    var userID = ""
    var haveSkill = ""
    var wantSkill = ""
    if (JSONResultStr == '[]') {
        // 取得データが空の時
        nickname = "IDが該当するユーザー見つかりませんでした"
    } else if (!JSONResultStr == '') {
        json = JSON.parse(JSONResultStr)
        nickname = json[0].nickname
        userID = json[0].id
        haveSkill = json[0].haveSkill
        wantSkill = json[0].wantSkill
    }

    // 'Access-Control-Allow-Credentials' はAPIGatewayのCORS有効化時にtrueにしてます
    const useCallCoachingRequestAPI = async() => {
        const API_ENDPOINT = apigatewayConf.END_POINT_URL
        const creqRoute = "/dev/coaching/send"
        const creqQuery = "?reqUID="+userID+"&senderUID="+currentUserID
        const creqURL = API_ENDPOINT + creqRoute + creqQuery;
        try {
            const response = await axios.post(creqURL,{},
                {
                    headers: {
                        'X-Api-Key': apigatewayConf.API_KEY,
                        'Content-Type':'text/plain',           
                    }
                }         
            );
            console.log("APIキー認証込みでコーチングリクエストを送信しました。詳細は以下です。")
            console.log(response.data)
            alert('コーチングリクエストを送信しました')
        } catch (error) {
            console.error(error)
            alert('リクエスト処理に失敗しました')
        }
    }
    // ユーザー保留機能
    const pendingUserForRequest = async() =>{
      const API_ENDPOINT = apigatewayConf.END_POINT_URL
      const creqRoute = "/dev/coaching/pending"
      // uid = 保留されるユーザー puid = 保留をするユーザー(自分)
      const creqQuery = "?uid="+ userID + "&puid=" + currentUser.ID
      const creqURL = API_ENDPOINT + creqRoute + creqQuery;
      try {
          const response = await axios.post(creqURL,{},
              {
                  headers: {
                      'X-Api-Key': apigatewayConf.API_KEY,
                      'Content-Type':'text/plain',           
                  }
              }         
          );
          console.log(response.data)
          alert('ユーザーを保留しました')
      } catch (error) {
          console.error(error)
          alert('リクエスト処理に失敗しました')
      }
    }

    return (
        <div className="matchedUserInfo">
        <Box>
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
                src={img}
                style={{
                  width: "200px",
                  height: "200px",
                  borderRadius: "50%",
                  objectFit: "cover",
                }}
              />
            </Grid>
    
            {/*マッチングしたユーザ名*/}
            <Grid>名前:{nickname}</Grid>
            <Grid>ID:{userID}</Grid>
            {/*星マーク指定　星の数 星のサイズ*/}
            <Grid>
              評価(このへんはあとで機能追加するとこ)
              <ReactStars
                count={5}
                onChange={ratingChanged}
                size={24}
                activeColor="#ffd700"
              />
              <label>実績: 件</label>
            </Grid>
    
            <Grid>
              <p>自己紹介:(自己紹介投稿機能が完成したら取得するようにする)</p>
            </Grid>
            <Grid>
                <p>教えたいスキルがあるゲーム:{haveSkill}</p>
                <p>教わりたいスキルがあるゲーム:{wantSkill}</p>
            </Grid>
            <Grid item xs={5} sm={8} pt={5}>
              <Button
                style={{
                  width: "300px",
                  height: "50px",
                }}
                label="コーチングリクエストを送る"
                onClick={useCallCoachingRequestAPI}
              />
            </Grid>
    
            <Grid item xs={5} sm={8} pt={5}>
              <Button
                style={{
                  width: "300px",
                  height: "50px",
                }}
                label="保留する"
                onClick={pendingUserForRequest}
              />
            </Grid>
          </Grid>
        </Box>
        </div>
        /*<div className="matcheduser">
            <p>ユーザー名:{nickname}</p>
            <p>id: {userID}</p>
            <p>教えたいスキルがあるゲーム:{haveSkill}</p>
            <p>教わりたいスキルがあるゲーム:{wantSkill}</p>
            <button onClick={useCallCoachingRequestAPI}>コーチングリクエストを送る</button><br></br>
            <a href='/matching'>戻る</a>
        </div>*/
    )
}
export default UserProfile