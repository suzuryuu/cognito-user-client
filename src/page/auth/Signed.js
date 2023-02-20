import React from 'react'
import '../../App.css'
import { Link } from 'react-router-dom';
import SignOut from '../../page/auth/SignOut'
import { Button } from '@mui/material'
import Grid from "@mui/material/Grid";
import { CognitoUserPool } from "amazon-cognito-identity-js"
import awsConfiguration from '../../conf/awsauth'
import apigatewayConf from '../../conf/apigateway'
import { useEffect } from 'react'
import axios from 'axios'
import currentUser from '../common/getCurrentUser';
import Footer from '../common/Footer';

//newsカード
import valo from "../../style/valosen.jpg";
import usr from "../../style/user.jpg";
import apex from "../../style/apexsen.jpg";
import spla from "../../style/splasen.jpg";
import vlcmp from "../../style/vlcmp.jpg"
import "../../style/Home.css";
import "../../style/footer.css"


// MUIのアイコン
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import SendIcon from '@mui/icons-material/Send';
import PendingIcon from '@mui/icons-material/Pending';
import SearchIcon from '@mui/icons-material/Search';
import HomeIcon from '@mui/icons-material/Home';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import Search from '@mui/icons-material/Search';
import { IconButton } from '@mui/material';
import AccountCircle from '@mui/icons-material/AccountCircle';

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
    const queryParam = '?requid=' + currentUser.ID;

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
    const queryParam = '?suid=' + currentUser.ID;

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
      <h2><HomeIcon></HomeIcon>HOME</h2>
      <Grid container justifyContent={"center"} style={{}} columnGap={5} className="functions">
        
        <Button
          variant="contained"
          color="warning"
          style={{ height: 50, width: 200, marginTop: 30 }}
          component={Link}
          to="/matching"
        ><Search></Search></Button>
        
        <Button
          variant="contained"
          color="warning"
          style={{ height: 50, width: 200, marginTop: 30 }}
          component={Link}
          to="/requests"
        ><NotificationsActiveIcon></NotificationsActiveIcon>(<p style={{ color: 'yellow' }}>{notifycount}</p>)</Button>
        
        <Button
          variant="contained"
          color="warning"
          style={{ height: 50, width: 200, marginTop: 30 }}
          component={Link}
          to="/requests/yourself"
        ><SendIcon></SendIcon>(承認:<p style={{ color: 'yellow' }}>{acceptedCount}</p>/<p style={{ color: 'white' }}>{requestedYourSelfCount}</p>)</Button>
        
        <Button
          variant="contained"
          color="warning"
          style={{ height: 50, width: 200, marginTop: 30 }}
          component={Link}
          to="/requests/pending"
        ><PendingIcon></PendingIcon>保留したユーザー(<p>{pendingUserCount}</p>)</Button>
      

      </Grid>
      <p className='newstitle' style={{ fontWeight: "bold" }}>最近のおすすめニュース</p>
      <div className='newscontent'>
        <Grid container justifyContent={'center'} columnGap={3} className='newsContainer' style={{}}>

          <div className="borderOutline" style={{marginBottom: 20}}>
            <div className="newsgridItem">
              <br></br>
              <p style={{ fontWeight: "bold" }} >ダイヤで沼っていたxxさん「あること」に気づきアセンダントへ。</p>
              <img src={vlcmp} width="100%" /><br></br>
              <Button
                variant="outlined"
                color="primary"
                style={{ height: 40, width: 170, marginBottom: 20 }}
                component={Link}
                to="#"
              >この記事を見る</Button>
            </div>
          </div>

          <div className="borderOutline" style={{marginBottom: 20}}>
            <div className="newsgridItem">
              <br></br>
              <p style={{ fontWeight: "bold" }} >まさか!?ヨル使いのエキスパート現る!!!～逆張りに学べ～</p>
              <img src={valo} width="100%" /><br></br>
              <Button
                variant="outlined"
                color="primary"
                style={{ height: 40, width: 170, marginBottom: 20 }}
                component={Link}
                to="#"
              >この記事を見る</Button>
            </div>
          </div>

          <div className="borderOutline" style={{marginBottom: 20}}>
            <div className="newsgridItem">
              <br></br>
              <p style={{ fontWeight: "bold" }} >コーチングによりX帯到達! 「マッチングした相手のアドバイスのおかげで...</p>
              <img src={spla} width="100%" /><br></br>
              <Button
                variant="outlined"
                color="primary"
                style={{ height: 40, width: 170, marginBottom: 20 }}
                component={Link}
                to="#"
              >この記事を見る</Button>
            </div>
          </div>
        </Grid>
        <Grid container justifyContent={'center'} columnGap={3} className='newsContainer2'>
          
          <div className="borderOutline" style={{marginBottom: 20}}>
            <div className="newsgridItem">
              <br></br>
              <p style={{ fontWeight: "bold" }} >平均評価☆4.8のxxさんによる教え方のコツとは?</p>
              <img src={usr} width="180px" height="100%" /><br></br>
              <Button
                variant="outlined"
                color="primary"
                style={{ height: 40, width: 170, marginBottom: 20 }}
                component={Link}
                to="#"
              >この記事を見る</Button>
            </div>
          </div>

          <div className="borderOutline" style={{marginBottom: 20}}>
            <div className="newsgridItem">
              <br></br>
              <p style={{ fontWeight: "bold" }} >プレデターに挑戦中の猛者現る!!!(xxさん)</p>
              <img src={apex} width="100%" /><br></br>
              <Button
                variant="outlined"
                color="primary"
                style={{ height: 40, width: 170, marginBottom: 20 }}
                component={Link}
                to="#"
              >この記事を見る</Button>
            </div>
          </div>

          <div className="borderOutline" style={{marginBottom: 20}}>
            <div className="newsgridItem">
              <br></br>
              <p style={{ fontWeight: "bold" }} >プラチナ4で沼っていたけどダイヤに到達したzzさん。何の意識を変えた?</p>
              <img src={apex} width="100%" /><br></br>
              <Button
                variant="outlined"
                color="primary"
                style={{ height: 40, width: 170, marginBottom: 20 }}
                component={Link}
                to="#"
              >この記事を見る</Button>
            </div>
          </div>
        </Grid>
      </div>
      <Footer></Footer>
    </div>
  )
}
export default Signed