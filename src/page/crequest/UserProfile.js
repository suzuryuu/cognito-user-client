
// TODO:自分のプロフィールはMyProfile.js的なものにする
import React from 'react'
import '../../App.css'
import { useLocation, useNavigate } from 'react-router-dom'
import apigatewayConf from '../../conf/apigateway'
import { useEffect } from 'react'
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
const ratingChanged = (newRating) => {};
const RequestedUserProfile = () => {
    var [JSONResultStr, setJSONStr] = React.useState('')

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
            } else if (reqStatus == "decline") {
               statusToJapanese = "拒否"
            }
            alert('リクエスト確認完了:' + statusToJapanese)
            window.location.href="/requests"
        } catch (error) {
            console.error(error)

            if (reqStatus == "accept") {
                alert("承認に失敗しました")
            } else if (reqStatus == "decline") {
                alert("拒否に失敗しました")
            }
        }
    }

    const onClickAccept = () => {
        callEditStatusAPI("accept")
    }

    const onClickDecline = () => {
        callEditStatusAPI("decline")
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