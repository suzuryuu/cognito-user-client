
// TODO:自分のプロフィールはMyProfile.js的なものにする
import React from 'react'
import '../../App.css'
import { useLocation, useNavigate } from 'react-router-dom'
import apigatewayConf from '../../conf/apigateway'
import { useEffect, useState } from 'react'

import axios from 'axios'
import { paste } from '@testing-library/user-event/dist/paste'

import { CognitoUserPool } from "amazon-cognito-identity-js"
import awsConfiguration from '../../conf/awsauth'
import { ConstructionOutlined } from '@mui/icons-material'
import { Button } from "@mui/material";
// S3とか使って好きなアイコン設定できるようにする？
import img from "../../style/user.jpg";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import ReactStars from "react-rating-stars-component";
import '../../style/matching.css'
import '../../style/profile.css'
import currentUser from '../common/getCurrentUser'
import { Rating } from '@mui/material'

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
const ratingChanged = (newRating) => { };

const UserProfile = () => {
  var [JSONResultStr, setJSONStr] = React.useState('')

  /*プロフィール画像処理*/
  const [imagecrop, setimagecrop] = useState("");
  const [src] = useState(false);
  const [profile, setprofile] = useState([]);
  const [pview, setpview] = useState(false);
  const profileFinal = profile.map((item) => item.pview);

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
      setpview(
        res.data[0].picture
      )
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
  var intro = ""
  if (JSONResultStr == '[]') {
    // 取得データが空の時
    nickname = "IDが該当するユーザー見つかりませんでした"
  } else if (!JSONResultStr == '') {
    json = JSON.parse(JSONResultStr)
    nickname = json[0].nickname
    userID = json[0].id
    haveSkill = json[0].haveSkill
    wantSkill = json[0].wantSkill
    intro = json[0].intro
  }

  // 'Access-Control-Allow-Credentials' はAPIGatewayのCORS有効化時にtrueにしてます
  const useCallCoachingRequestAPI = async () => {
    const API_ENDPOINT = apigatewayConf.END_POINT_URL
    const creqRoute = "/dev/coaching/send"
    const creqQuery = "?reqUID=" + userID + "&senderUID=" + currentUserID
    const creqURL = API_ENDPOINT + creqRoute + creqQuery;
    try {
      const response = await axios.post(creqURL, {},
        {
          headers: {
            'X-Api-Key': apigatewayConf.API_KEY,
            'Content-Type': 'text/plain',
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
  const pendingUserForRequest = async () => {
    const API_ENDPOINT = apigatewayConf.END_POINT_URL
    const creqRoute = "/dev/coaching/pending"
    // uid = 保留されるユーザー puid = 保留をするユーザー(自分)
    const creqQuery = "?uid=" + userID + "&puid=" + currentUser.ID
    const creqURL = API_ENDPOINT + creqRoute + creqQuery;
    try {
      const response = await axios.post(creqURL, {},
        {
          headers: {
            'X-Api-Key': apigatewayConf.API_KEY,
            'Content-Type': 'text/plain',
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
  // 評価一覧用の追加記述
    
  var [JSONResultStrForFeedback, setJSONStrForFeedback] = React.useState('')
  var [avgScoreOfStar, setScore] = React.useState()
  const useFeedBackInfo = () =>{
    const URL =  apigatewayConf.END_POINT_URL + "/dev/users/feedback/get?id=" + id
      // ページのレンダでAPIリクエストを送る場合はuseEffectを使用する
      useEffect(() => {
          axios.get(URL, {
              'Access-Control-Allow-Origin': '*',
              'Access-Control-Allow-Headers': '*',
          }).then((res) => {
              setJSONStrForFeedback(JSON.stringify(res.data))
              //　平均評価取得部分
              var sum = 0;
              for(var i = 0; i< res.data.length; i++){
                sum += parseInt(res.data[i].star,10) // starデータは文字列なので
              }
              const data = sum / res.data.length
              const digit = 1 // 少数点 n位まで四捨五入
              const avgResult = data.toFixed(digit)
              setScore(avgResult)
              console.log("平均評価:"+avgResult)
              console.log(res.data)
              console.log("評価データ取得成功")
          }).catch((e)=>{
              console.log(e)
          })
      }, [])
  }

  useFeedBackInfo()

  // 評価一覧のDOM listを返す
  const JSONparse = ()=>{
      var list = []
      // JSONResultStrは最初空なので空リストを返す
      if(JSONResultStrForFeedback == ''){
          //console.log("current-json-value<string>:"+JSONResultStr)
          list = [""]
      }
      // 該当ユーザーが見つからない場合空のjson配列が返ってくるので
      else if(JSONResultStrForFeedback == '[]'){
          list.push(<h2>評価した人はまだいません</h2>)
      }
      else{
          const json = JSON.parse(JSONResultStrForFeedback)
          for(var i = 0; i < json.length; i++){
              // user feedback content
              list.push(
              <div className="usrfdContent">
                <div className="picnamestar">
                <img src={json[i].picture } width="18%"></img>
                <p><a href={"/user?id="+ json[i].fdb_user_id}>{json[i].fdb_nickname}</a>さん</p>
                <Rating name="half-rating" defaultValue={json[i].star} precision={0.5} readOnly/>
                </div>
                <div className="feedbackcomment">
                <p style={{fontWeight:"bold" ,marginBottom: 5}}>コメント</p>  
                <p style={{marginTop: 5}}>{json[i].content}</p>
                </div>
              </div>  
              )
          }
      }
      return list
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
          <p style={{ fontWeight: "bold"}}>平均評価</p>
          <h3 class="result-rating-rate">
            <span class="star5_rating" data-rate={avgScoreOfStar}></span>
            <span class="number_rating">{avgScoreOfStar}</span>
          </h3>
          </Grid>
    
            <Grid>
              <p><b>自己紹介:</b>{intro}</p>
            </Grid>
            <Grid>
                <p><b>教えたいスキルがあるゲーム:</b>{haveSkill}</p>
                <p><b>教わりたいスキルがあるゲーム:</b>{wantSkill}</p>
            </Grid>
          <Grid item xs={5} sm={8} pt={5}>
            <Button
              variant="contained"
              color="warning"
              style={{
                width: "300px",
                height: "50px",
              }}
              onClick={useCallCoachingRequestAPI}
            >コーチングリクエストを送る</Button>
          </Grid>

          <Grid item xs={5} sm={8} pt={5}>
            <Button
             variant="contained"
             color="warning"
              style={{
                width: "300px",
                height: "50px",
                marginBottom: 150
              }}
          
              onClick={pendingUserForRequest}
            >保留する</Button>
          </Grid>

          <h2>このユーザーの評価</h2>
          {JSONparse()}
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