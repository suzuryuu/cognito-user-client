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
import currentUser from '../common/getCurrentUser';

//newsカード
import valo from "../../style/valosen.jpg";
import apex from "../../style/apexsen.jpg";
import spla from "../../style/splasen.jpg";
import "../../style/Home.css";


// MUIのアイコン
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import SendIcon from '@mui/icons-material/Send';
import PendingIcon from '@mui/icons-material/Pending';


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

const Signed = () => {
  // 通知のためのjsonの入れ物
  var jsonForNotifyCount = ""
  // 承認されたリクエストをカウントするためのjsonの入れ物
  var jsonForAcceptedCount = ""

  // 保留ユーザーのカウントのためのjsonのいれもの
  var jsonForPendingCount = ""
  // 自分が送ったリクエストのカウント
  var requestedYourSelfCount = 0;
  // 自分が送ったリクエストの中で承認されたもののカウント
  var acceptedCount = 0;
  // リクエストがいくつ届いてるかカウント
  var notifycount = 0;
  // リクエストを送ろうか保留しているユーザー数のカウント
  var pendingUserCount = 0;

  // 共通で使うリクエストURLで使う変数
  var query = ""
  var route = ""


  const useCountFor = (value) => {
    var [JSONResultStr, setJSONStr] = React.useState('')
    const API_ENDPOINT = apigatewayConf.END_POINT_URL
    query = '?userid=' + currentUser.ID
    route = '/dev/coaching/getpending'

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
    if (!JSONResultStr == '') {
      jsonForPendingCount = JSON.parse(JSONResultStr)
      pendingUserCount = jsonForPendingCount.length;
    }
  }

  // 処理の重複記述が多いので後でリファクタリングする
  const useNotifyCount = () => {
    var [JSONResultStr, setJSONStr] = React.useState('')
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

    if (!JSONResultStr == '') {
      jsonForNotifyCount = JSON.parse(JSONResultStr)
      notifycount = jsonForNotifyCount.length
    }
  }

  const useAcceptedCount = () => {
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

    if (!JSONResultStr == '') {
      jsonForAcceptedCount = JSON.parse(JSONResultStr)
      requestedYourSelfCount = jsonForAcceptedCount.length;
      for (var i = 0; i < jsonForAcceptedCount.length; i++) {
        if (jsonForAcceptedCount[i].reqStatus == "accept") {
          acceptedCount++;
        }
      }
    }
  }

  useNotifyCount()
  useAcceptedCount()
  useCountFor("pending")
  return (
    <div className="authorizedMode">
      <h2>HOME</h2>
      <Grid container justifyContent={'center'} columnGap={3} style={{}}>
        <Button
          variant="contained"
          color="primary"
          style={{ height: 80, width: 250, }}
          component={Link}
          to="/matching"
        >マッチするユーザーを探す
        </Button>
        <Button
          variant="contained"
          color="primary"
          style={{ height: 80, width: 250 }}
          component={Link}
          to="requests"
        ><NotificationsActiveIcon></NotificationsActiveIcon>届いたリクエスト(<p style={{ color: 'yellow' }}>{notifycount}</p>)
        </Button>
        <Button
          variant="contained"
          color="primary"
          style={{ height: 80, width: 250 }}
          component={Link}
          to="requests/yourself"
        ><SendIcon></SendIcon>送ったリクエスト(承認:<p style={{ color: 'yellow' }}>{acceptedCount}</p>/<p style={{ color: 'white' }}>{requestedYourSelfCount}</p>)
        </Button>
        <Button
          variant="contained"
          color="primary"
          style={{ height: 80, width: 250 }}
          component={Link}
          to="requests/pending"
        ><PendingIcon></PendingIcon>保留したユーザー(<p>{pendingUserCount}</p>)
        </Button>
        {/*<SignOut />*/}
      </Grid>

      <div className='newscontent'>
      {/*ニュース的なもの(dummy)**/}
      <text class="text">
        <>News</>
      </text>
      <hr />
      <br />
      <div class="hrtitle" />
      <text class="game">VALORANT</text>
      <p class="ichigyou">
        <img src={valo} width="500" />
        <a>
          <span>まさか!?ヨル使いのエキスパート現る!!!～逆張りに学べ～</span>
          <br />
          <br />
          <span>先週アクティブユーザー20人</span>
        </a>
      </p>
      <hr />

      <text class="game">Apex Legends</text>
      <p class="ichigyou">
        <img src={apex} width="500" />
        <a>
          <span>プレデターに挑戦中の猛者現る!!!</span>
          <br />
          <br />
          <span>先週アクティブユーザー最多!!!</span>
        </a>
      </p>
      <hr />

      <text class="game">Splatoon</text>
      <p class="ichigyou">
        <img src={spla} width="500" />
         <a>
          <span>コーチングによりX帯到達者現る!!!</span>
          <br />
          <br />
          <span>先週アクティブユーザー46人</span>
          </a>
      </p>
      <hr />
      </div>
    </div>
  )
}
export default Signed