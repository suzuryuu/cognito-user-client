
// TODO:自分のプロフィールはMyProfile.js的なものにする
import React from 'react'
import '../../App.css'
import { useLocation, useNavigate } from 'react-router-dom'
import apigatewatConf from '../../conf/apigateway'
import { useEffect } from 'react'

import axios from 'axios'
import { paste } from '@testing-library/user-event/dist/paste'
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
    if (JSONResultStr == '[]') {
        // 取得データが空の時
        nickname = "IDが該当するユーザー見つかりませんでした"
    }else if (!JSONResultStr == '') {
        json = JSON.parse(JSONResultStr)
        nickname = json[0].nickname
        userID = json[0].id
        haveSkill = json[0].haveSkill
        wantSkill = json[0].wantSkill
    }
    return (
        <div className="matcheduser">          
            <p>ユーザー名:{nickname}</p>
            <p>id: {userID}</p>
            <p>教えたいスキルがあるゲーム:{haveSkill}</p>
            <p>教わりたいスキルがあるゲーム:{wantSkill}</p>
            <a href='/matching'>戻る</a>
        </div>
    )
}

export default NormalUserProfile