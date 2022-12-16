
// TODO:自分のプロフィールはMyProfile.js的なものにする
import React from 'react'
import '../../App.css'
import { useLocation, useNavigate } from 'react-router-dom'
import apigatewayConf from '../../conf/apigateway'
import { useEffect } from 'react'
import axios from 'axios'

// リクエストを送って来たuserのプロフィール

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
                        'X-Api-Key': apigatewayConf.API_KEY,
                        'Content-Type': 'text/plain',
                    }
                }
            );
            console.log(response.data)
            alert('リクエスト状態書き換え:' + reqStatus)
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
        <div className="matcheduser">
            <p>リクエストID:{reqIdparam}</p>
            <p>ユーザー名:{nickname}</p>
            <p>id: {userID}</p>
            <p>教えたいスキルがあるゲーム:{haveSkill}</p>
            <p>教わりたいスキルがあるゲーム:{wantSkill}</p>
            <button onClick={onClickAccept}>承認</button>
            <button onClick={onClickDecline}>拒否</button>
        </div>
    )
}

export default RequestedUserProfile