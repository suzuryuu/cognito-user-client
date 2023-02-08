
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
import '../../style/profile.css'

import { Link } from 'react-router-dom'
import currentUser from '../common/getCurrentUser';
import { Button } from "@mui/material";
import { Rating } from "@mui/material";

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
    window.location.href = "/"
    localStorage.clear()
    console.log('signed out')
  } else {
    localStorage.clear()
    console.log('no user signing in')
  }
}

/*星マークの受付*/
const ratingChanged = (newRating) => { }

// Box要素内はButtonのLink toが効かないのでonClickで遷移メソッドを呼ぶ
const onClickMoveToEdit = () => {
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
    }).catch((e) => {
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
  } else if (!JSONResultStr == '') {
    json = JSON.parse(JSONResultStr)
    nickname = json[0].nickname
    userID = json[0].id
    haveSkill = json[0].haveSkill
    wantSkill = json[0].wantSkill
    intro = json[0].intro
  }



  var [JSONResultStrForFeedback, setJSONStrForFeedback] = React.useState('')
  var [avgScoreOfStar, setScore] = React.useState()
  const useFeedBackInfo = () => {
    const URL = apigatewatConf.END_POINT_URL + "/dev/users/feedback/get?id=" + currentUser.ID
    // ページのレンダでAPIリクエストを送る場合はuseEffectを使用する
    useEffect(() => {
      axios.get(URL, {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': '*',
      }).then((res) => {
        setJSONStrForFeedback(JSON.stringify(res.data))
        //　平均評価取得部分
        var sum = 0;
        for (var i = 0; i < res.data.length; i++) {
          sum += parseInt(res.data[i].star, 10) // starデータは文字列なので10進数intに変換
        }
        const data = sum / res.data.length
        const digit = 1 // 少数点 n位まで四捨五入
        const avgResult = data.toFixed(digit)
        setScore(avgResult)
        console.log("平均評価:" + avgResult)
        console.log(res.data)
        console.log("評価データ取得成功")
      }).catch((e) => {
        console.log(e)
      })
    }, [])
  }

  useFeedBackInfo()

  // 評価一覧のDOM listを返す
  const JSONparse = () => {
    var list = []
    // JSONResultStrは最初空なので空リストを返す
    if (JSONResultStrForFeedback == '') {
      //console.log("current-json-value<string>:"+JSONResultStr)
      list = [""]
    }
    // 該当ユーザーが見つからない場合空のjson配列が返ってくるので
    else if (JSONResultStrForFeedback == '[]') {
      list.push(<h2>評価した人はまだいません</h2>)
    }
    else {
      const json = JSON.parse(JSONResultStrForFeedback)
      for (var i = 0; i < json.length; i++) {
        // user feedback content
        list.push(
          <div className="usrfdContent">
            <div className="picnamestar">
              <img src={json[i].picture} width="18%"></img>
              <p><a href={"/user?id=" + json[i].fdb_user_id}>{json[i].fdb_nickname}</a>さん</p>
              <Rating name="half-rating" defaultValue={json[i].star} precision={0.5} readOnly />
            </div>
            <div className="feedbackcomment">
              <p style={{ fontWeight: "bold", marginBottom: 5 }}>コメント</p>
              <p style={{ marginTop: 5 }}>{json[i].content}</p>
            </div>
          </div>
        )
      }
    }
    return list
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
        <Grid><p style={{ fontSize: 12, color: "gray" }}>ID:{userID}</p></Grid>

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
        {/*星マーク指定　星の数 星のサイズ*/}
        {/** React Starsだと☆の数を変数で指定すると表示されないのでhtml/cssで作っている例を使いました((https://goat-inc.co.jp/blog/891/) */}
        <Grid style={{ paddingTop: 20 }}>
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
        <h2>あなたの評価</h2>
        {JSONparse()}
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