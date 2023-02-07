
// TODO:自分のプロフィールはMyProfile.js的なものにする
import React from 'react'
import '../../App.css'
import { useLocation, useNavigate } from 'react-router-dom'
import apigatewayConf from '../../conf/apigateway'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { Button } from "@mui/material";
// S3とか使って好きなアイコン設定できるようにする？
import img from "../../style/user.jpg";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import ReactStars from "react-rating-stars-component";
import '../../style/matching.css'
import '../../style/profile.css'

import { Rating } from "@mui/material"

// リクエストを送って来たuserのプロフィール
/*星マークの受付*/
const ratingChanged = (newRating) => { };
const RequestedUserProfile = () => {
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
  const reqIdparam = query.get('reqIdprm')
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
      console.log(e)
      //alert('マッチングの為の入力が不十分です。')
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

  const callEditStatusAPI = async (reqStatus) => {
    const API_ENDPOINT = apigatewayConf.END_POINT_URL
    const editStsRoute = "/dev/coaching/chreq"
    const editStsQuery = "?crPK=" + reqIdparam + "&reqsts=" + reqStatus
    const editStsReqUrl = API_ENDPOINT + editStsRoute + editStsQuery

    try {
      const response = await axios.post(editStsReqUrl, {},
        // data empty
        {
          headers: {
            'Content-Type': 'text/plain',
            'X-Api-Key': apigatewayConf.API_KEY,
            //  'Access-Control-Allow-Origin' : 'http://localhost:3000'
          }
        }
      );
      console.log(response.data)
      var statusToJapanese = ""
      if (reqStatus == "accept") {
        statusToJapanese = "承認"
      }
      alert('リクエスト確認完了: 承認')
      window.location.href = "/requests"
    } catch (error) {
      console.error(error)
      alert("承認に失敗しました")
    }
  }
  // 拒否したらリクエストを削除するように変更
  const callDeleteReqSession = async () => {
    const API_ENDPOINT = apigatewayConf.END_POINT_URL
    const route = "/dev/coaching/destroyreq"
    const query = "?crPK=" + reqIdparam
    const reqUrl = API_ENDPOINT + route + query

    try {
      const response = await axios.delete(reqUrl,
        {
          headers: {
            'X-Api-Key': apigatewayConf.API_KEY,
            'Content-Type': 'text/plain',
          }
        }
      );
      console.log(response.data)
      alert('リクエスト確認完了: 拒否')
      window.location.href = "/requests"
    } catch (error) {
      console.error(error)
      alert("拒否に失敗しました。")
    }
  }

  const onClickAccept = () => {
    callEditStatusAPI("accept")
  }

  const onClickDecline = () => {
    callDeleteReqSession()
  }
  
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
    <div className="requestSenderInfo">
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
            平均評価:
            {/*<ReactStars
              count={5}
              onChange={ratingChanged}
              size={24}
              activeColor="#ffd700"
            />*/}{/* これやりたいけどできない<Rating name="half-rating" defaultValue={parseInt(avgScoreOfStar,10)} precision={0.5} readOnly/>*/}
            {avgScoreOfStar}/5
          </Grid>

          <Grid>
            <p>自己紹介:{intro}</p>
          </Grid>

          <Grid item xs={5} sm={8} pt={5}>
            <Button
              variant="contained"
              color="success"
              style={{
                width: "300px",
                height: "50px",
              }}
              onClick={onClickAccept}
            >✔承認</Button>
          </Grid>

          <Grid item xs={5} sm={8} pt={5}>
            <Button
              variant="contained"
              color="error"
              style={{
                width: "300px",
                height: "50px",
              }}
              onClick={onClickDecline}
            >✖拒否</Button>
          </Grid>

          <h2>このユーザーの評価</h2>
        {JSONparse()}
        </Grid>
      </Box>
    </div>
    /*<div className="matcheduser">
        <p>リクエストID:{reqIdparam}</p>
        <p>ユーザー名:{nickname}</p>
        <p>id: {userID}</p>
        <p>教えたいスキルがあるゲーム:{haveSkill}</p>
        <p>教わりたいスキルがあるゲーム:{wantSkill}</p>
        <button onClick={onClickAccept}>承認</button>
        <button onClick={onClickDecline}>拒否</button>
    </div>*/
  )
}

export default RequestedUserProfile