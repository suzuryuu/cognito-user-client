
// TODO:自分のプロフィールはMyProfile.js的なものにする
import React from 'react'
import '../../App.css'
import { useLocation, useNavigate } from 'react-router-dom'
import apigatewayConf from '../../conf/apigateway'
import { useEffect, useState } from 'react'
import axios from 'axios'

import { Button } from "primereact/button";
// S3とか使って好きなアイコン設定できるようにする？
import img from "../../style/user.jpg";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import ReactStars from "react-rating-stars-component";
import '../../style/matching.css'

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
          <Grid>名前:{nickname}</Grid>
          <Grid>ID:{userID}</Grid>

          {/*星マーク指定　星の数 星のサイズ*/}
          <Grid>
            評価
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

          <Grid item xs={5} sm={8} pt={5}>
            <Button
              style={{
                width: "300px",
                height: "50px",
              }}
              label="承認"
              onClick={onClickAccept}
            />
          </Grid>

          <Grid item xs={5} sm={8} pt={5}>
            <Button
              style={{
                width: "300px",
                height: "50px",
              }}
              label="拒否"
              onClick={onClickDecline}
            />
          </Grid>
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