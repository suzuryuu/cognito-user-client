import React from 'react'
import '../../../App.css'
import { Link } from 'react-router-dom';
import Button from '@material-ui/core/Button'
import Grid from "@mui/material/Grid";
import { CognitoUserPool } from "amazon-cognito-identity-js"
import '../../../style/reqIndex.css'
import apigatewayConf from '../../../conf/apigateway'
import { useEffect } from 'react'
import axios from 'axios'
import currentUser from '../../common/getCurrentUser';
const PendingUserIndex = () => {
    var [JSONResultStr, setJSONStr] = React.useState('')
    const API_ENDPOINT = apigatewayConf.END_POINT_URL
    const query = '?userid=' + currentUser.ID
    const route = '/dev/coaching/getpending'

    // 保留モデルのID
    var pendingID = ""


    const requestUrl = API_ENDPOINT + route + query
    // ページのレンダでAPIリクエストを送る場合はuseEffectを使用する
    useEffect(() => {
        axios.get(requestUrl,
            {
                headers: {
                    'Content-Type': 'text/plain',
                    'X-Api-Key': apigatewayConf.API_KEY,
                    //  'Access-Control-Allow-Origin' : 'http://localhost:3000'
                }
            },
        ).then((res) => {
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
            list = ["保留したユーザーはいません"];
        }
        else {
            //console.log("current-json-value<string>:"+JSONResultStr)
            const json = JSON.parse(JSONResultStr)
            for (var i = 0; i < json.length; i++) {
                const userid = json[i].uid
                const idToQueryPath = "/matching/user?id=" + userid
                pendingID = json[i].id
                list.push(
                    <div>
                        <Grid item xs={12} className="reqIndex">
                            <p>保留中のユーザーID:{userid}</p>
                            <Button
                                variant="contained"
                                color="primary"
                                style={{ height: 50, width: 100}}
                                component={Link}
                                to={idToQueryPath}
                            >詳細
                            </Button>
                            <Button
                                variant="contained"
                                color="secondary"
                                style={{ height: 50, width: 100}}
                                onClick={onClickDeletePending}
                            >削除
                            </Button>
                        </Grid>
                    </div>
                )
            }
        }
        return list
    }

    
    const onClickDeletePending = async() =>{
        const API_ENDPOINT = apigatewayConf.END_POINT_URL
        const route = "/dev/coaching/pending/destroy"
        const query = "?id=" + pendingID
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
            alert('保留しているユーザーを削除しました')
            window.location.href = "/requests/pending"
        } catch (error) {
            console.error(error)
            alert("削除失敗")
        }
    }
    return (
        <div className="pendingcontent">
            <h2>保留したユーザーの一覧</h2>
            <Grid container justifyContent={'center'} columnGap={5} className='myreqUserContainer'>
                {JSONparse()}
            </Grid>
        </div>
    )
}

export default PendingUserIndex