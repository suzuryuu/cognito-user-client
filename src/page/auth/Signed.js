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

  return (
    <div className="authorizedMode">
      <h2><HomeIcon></HomeIcon>HOME</h2>
      <p className='newstitle' style={{ fontWeight: "bold" }}>最近のおすすめニュース</p>
        <div className='newscontent'>
          <Grid container justifyContent={'center'} columnGap={3} className='newsContainer' style={{}}>
            <div className="borderOutline">
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

            <div className="borderOutline">
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

            <div className="borderOutline">
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
          <Grid container justifyContent={'center'} columnGap={3} className='newsContainer2' style={{ paddingTop: 50, paddingBottom: 100 }}>
            <div className="borderOutline">
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

            <div className="borderOutline">
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

            <div className="borderOutline">
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