
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
            const response = await axios.post(creqURL,{
                'x-api-key': apigatewayConf.API_KEY,
                'Access-Control-Allow-Origin': 'http://localhost:3000',
                'Access-Control-Allow-Credentials':'true'                
            });
            console.log(response.data)
            alert('コーチングリクエストを送信しました')
        } catch (error) {
            console.error(error)
            alert('リクエスト処理に失敗しました')
        }
    }
    
    return (
        <div className="matcheduser">
            <p>ユーザー名:{nickname}</p>
            <p>id: {userID}</p>
            <p>教えたいスキルがあるゲーム:{haveSkill}</p>
            <p>教わりたいスキルがあるゲーム:{wantSkill}</p>
            <button onClick={useCallCoachingRequestAPI}>コーチングリクエストを送る</button><br></br>
            <a href='/matching'>戻る</a>
        </div>
    )
}
export default UserProfile