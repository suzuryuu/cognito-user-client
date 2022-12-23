
// TODO:自分のプロフィールはMyProfile.js的なものにする
import React from 'react'
import '../../App.css'
import { useLocation, useNavigate } from 'react-router-dom'
import apigatewatConf from '../../conf/apigateway'
import { useEffect } from 'react'

import axios from 'axios'
import { paste } from '@testing-library/user-event/dist/paste'

import { Button } from "primereact/button";
// S3とか使って好きなアイコン設定できるようにする？
import img from "../../style/user.jpg";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import ReactStars from "react-rating-stars-component";
import '../../style/matching.css'
import '../../style/reqIndex.css'
import { Link } from 'react-router-dom';

/*星マークの受付*/
const ratingChanged = (newRating) => {};

// マッチしてなくてもとにかくユーザーのリンクとして機能させるほう
const NormalUserProfile = () => {
    var [JSONResultStr, setJSONStr] = React.useState('')

    const search = useLocation().search
    const query = new URLSearchParams(search)
    const id = query.get('id')
    const queryParam = '?userid=' + id;

    const API_ENDPOINT = apigatewatConf.END_POINT_URL
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
        }).catch((e)=>{
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
              <p>自己紹介:{intro}</p>
            </Grid>
            <Grid>
                <p>教えたいスキルがあるゲーム:{haveSkill}</p>
                <p>教わりたいスキルがあるゲーム:{wantSkill}</p>
            </Grid>
            </Grid>
        </Box>
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

export default NormalUserProfile