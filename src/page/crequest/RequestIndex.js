import React from 'react'
import '../../App.css'
import { Link } from 'react-router-dom';
import SignOut from '../../page/auth/SignOut'
import Button from '@material-ui/core/Button'
import Grid from "@mui/material/Grid";
import { CognitoUserPool } from "amazon-cognito-identity-js"
import awsConfiguration from '../../conf/awsauth'
import apigatewayConf from '../../conf/apigateway'
import { useEffect } from 'react'
import axios from 'axios'
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

const RequestIndex = () => {
    var [JSONResultStr, setJSONStr] = React.useState('')
    var requestPartionKey  = "";
    const queryParam = '?requid=' + currentUserID;

    const API_ENDPOINT = apigatewayConf.END_POINT_URL
    const matchingRoute = '/dev/coaching/notify'
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
            console.log(e)
        })
    }, [])

    const onClickAccept = () =>{
        callEditStatusAPI("accept")
    }

    const onClickDecline = () =>{
        callEditStatusAPI("decline")
    }

    const JSONparse = ()=>{
        var list = []
        // JSONResultStrは最初空なので空リストを返す
        if(JSONResultStr == ''){
            //console.log("current-json-value<string>:"+JSONResultStr)
            list = [""]
        }
        // 該当ユーザーが見つからない場合空のjson配列が返ってくるので
        else if(JSONResultStr == '[]'){
            list = ["リクエストを送ってきたユーザーはまだいないようです。"];
        }
        else{
            //console.log("current-json-value<string>:"+JSONResultStr)
            const json = JSON.parse(JSONResultStr)
            for(var i = 0; i < json.length; i++){
                const sendersID = json[i].sender_uid
                requestPartionKey = json[i].id
                const idToQueryPath = "/matching/user?id=" + sendersID
                list.push(
                // listでDOM操作を仮で行ってますここをMUIで加工するといいかも
                <div>リクエストを送信したユーザー(id表記):{sendersID}
                <p><Link to={idToQueryPath}>プロフィールへ</Link></p>
               
                <button onClick={onClickAccept}>承認</button>
                <button onClick={onClickDecline}>拒否</button>
                </div>
                )
            }
        }
        return list
    }
    const callEditStatusAPI = async(reqStatus) =>{
        const API_ENDPOINT = apigatewayConf.END_POINT_URL
        const editStsRoute = "/dev/coaching/chreq"
        const editStsQuery = "?crPK="+ requestPartionKey +"&reqsts="+reqStatus
        const editStsReqUrl = API_ENDPOINT + editStsRoute + editStsQuery
        try {
            const response = await axios.post(editStsReqUrl,{
                'x-api-key': apigatewayConf.API_KEY,
                'Access-Control-Allow-Origin': 'http://localhost:3000',
                'Access-Control-Allow-Credentials':'true'
            });
            console.log(response.data)
            alert('リクエスト状態書き換え:'+reqStatus)
        } catch (error) {
            console.error(error)

            if(reqStatus == "accept"){
                alert("承認に失敗しました")
            }else if(reqStatus == "decline"){
                alert("拒否に失敗しました")
            }
        }
    }
    return(
    <div><h2>リクエスト一覧</h2>
        {JSONparse()}
    </div>)
}

export default RequestIndex