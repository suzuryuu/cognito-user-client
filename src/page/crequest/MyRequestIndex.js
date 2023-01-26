import React from 'react'
import '../../App.css'
import '../../style/reqIndex.css'
import { Link } from 'react-router-dom';
import SignOut from '../../page/auth/SignOut'
import Button from '@material-ui/core/Button'
import Grid from "@mui/material/Grid";
import { CognitoUserPool } from "amazon-cognito-identity-js"
import awsConfiguration from '../../conf/awsauth'
import apigatewayConf from '../../conf/apigateway'
import { useEffect } from 'react'
import axios from 'axios'


import ChatIcon from '@mui/icons-material/Chat'

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

const MyRequestIndex = () => {
    var [JSONResultStr, setJSONStr] = React.useState('')
    const queryParam = '?suid=' + currentUserID;

    const API_ENDPOINT = apigatewayConf.END_POINT_URL
    const matchingRoute = '/dev/coaching/myreq'
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


    

    const JSONparse = () => {
        var list = []
        // JSONResultStrは最初空なので空リストを返す
        if (JSONResultStr == '') {
            //console.log("current-json-value<string>:"+JSONResultStr)
            list = [""]
        }
        // 該当ユーザーが見つからない場合空のjson配列が返ってくるので
        else if (JSONResultStr == '[]') {
            list = [""];
        }
        else {
            //console.log("current-json-value<string>:"+JSONResultStr)
            const json = JSON.parse(JSONResultStr)
            for (var i = 0; i < json.length; i++) {
                const requestPK = json[i].id
                const requestedID = json[i].requested_uid
                const status = json[i].reqStatus;
                const chatRoomId = json[i].room_id;
                const pathForChat = "/chat?id=" + chatRoomId + "&uid=" + requestedID;

                // リクエストIDの確認 console.log(requestedID + "のPK:" + requestPK)
                //　状態分け
                var message = "";
                var link = ""
                if (status == "unconfirm") {
                    message = "未確認です。"
                } else if (status == "accept") {
                    message = "承認されました。"
                    link = <a href={pathForChat}>dmへ</a>
                } else if (status == "decline") {
                    message = "拒否されました。"
                }
                const idToQueryPath = "/user?id=" + requestedID

                const onClickDeleteRequest = async() =>{
                    const confirmDelete = window.confirm('本当にリクエストを削除しますか？(コーチング終了後に削除をしてください)'); 
                    if(confirmDelete === true){ // default: true
                        const API_ENDPOINT = apigatewayConf.END_POINT_URL
                        const route = "/dev/coaching/destroyreq"
                        const query = "?crPK=" + requestPK
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
                          alert('リクエストを削除しました')
                          window.location.href = "/requests/yourself"
                        } catch (error) {
                          console.error(error)
                          alert("削除処理にエラーが発生しました。")
                        }
                    }
                }

                // 拒否されたものは表示しない
                if (message == "未確認です。") {
                    list.push(
                        // listでDOM操作を仮で行ってますここをMUIで加工するといいかも
                        <div>
                            <Grid item xs={12} className="reqIndex">
                                <p>id:<Link to={idToQueryPath}>{requestedID}</Link></p>
                                <p>リクエストは{message}{link}</p>
                                {/*<p>user-id:{parsed[i].id}</p>*/}
                            </Grid>
                        </div>
                    )
                }
                else if (message == "承認されました。") {
                    list.push(
                        // listでDOM操作を仮で行ってますここをMUIで加工するといいかも
                        <div>
                            <Grid item xs={12} className="reqIndexAccepted">
                                <p>id:<Link to={idToQueryPath}>{requestedID}</Link></p>
                                <p>リクエストが{message}<ChatIcon></ChatIcon>{link}</p>
                                <p>コーチングが終了しましたか？:
                                    <Button
                                        variant="contained"
                                        color="secondary"
                                        style={{ height: 50, width: 140 }}
                                        onClick={onClickDeleteRequest}
                                    >リクエスト削除</Button>
                                </p>
                            </Grid>
                        </div>
                    )
                }

            }
        }
        return list
    }
    return (
        <div><h2>あなたが送ったコーチングリクエストの一覧</h2>
            <p style={{ color: '', fontSize: 13 }}>最新順表示。承認されてるものは色が濃くなっています。</p>
            <p style={{ color: '', fontSize: 13 }}>お互いにコーチングが終了したという認識がある場合にリクエストの削除をしてください</p>
            <Grid container justifyContent={'center'} columnGap={5} className='myreqUserContainer'>
                {JSONparse()}
            </Grid>
        </div>
    )
}

export default MyRequestIndex