import React from 'react'
import '../../App.css'
import '../../style/matching.css'
import axios from 'axios'

import { CognitoUserPool } from "amazon-cognito-identity-js"
import awsConfiguration from '../../conf/awsauth'
import { Link } from 'react-router-dom';

/*import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import NotificationsIcon from "@mui/icons-material/Notifications";
import ForumIcon from "@mui/icons-material/Forum";
import IconButton from "@mui/material/IconButton";*/
import Grid from "@mui/material/Grid"
import TextField from "@mui/material/TextField"
import Button from '@material-ui/core/Button'
import Autocomplete from "@mui/material/Autocomplete"
import NotificationsIcon from "@mui/icons-material/Notifications"
import ForumIcon from "@mui/icons-material/Forum"
import IconButton from "@mui/material/IconButton"

import SignOut from '../auth/SignOut'
import apigatewayConf from '../../conf/apigateway'



// 認証情報使用
const userPool = new CognitoUserPool({
  UserPoolId: awsConfiguration.UserPoolId,
  ClientId: awsConfiguration.ClientId,
})
const cognitoUser = userPool.getCurrentUser()
var currentUserID = 'User-ID-Value-From-Cognito' // 値を代入したいのでvarで定義

// 認証してる状態じゃないと取得できないので
if(cognitoUser != null){
    currentUserID = cognitoUser.getUsername()
}

var res_json =""
// haveSkill: 教えたい技術, wantSkill: 教わりたい技術
// userAにとってのhaveSkill -> userBのwantSkill,  A wantSkill -> B haveSkill
const Matching = () =>{
    const [haveSkill, setHaveSkill] = React.useState('')
    const [wantSkill, setWantSkill] = React.useState('')    

    // 文字列にしたjsonをstate管理
    const [JSONResultStr, setJSONStr] = React.useState('')
 
    const haveSkillHandler = (e) => setHaveSkill(e.target.value)
    const wantSkillHandler = (e) => setWantSkill(e.target.value)
    // マッチング部分のAPI呼び出し
    const handleCallAPI = async()=>{
        // CORS対策これ多分あまり意味ないですね
        axios.defaults.withCredentials = true;
        axios.defaults.baseURL = 'http://localhost:3000'

        const API_ENDPOINT = apigatewayConf.END_POINT_URL
        const matchingRoute = '/dev/m-result'
        const query = '?wskill=' + wantSkill + '&hskill=' + haveSkill
        const requestUrl = API_ENDPOINT + matchingRoute + query
    
        try {
            const response = await axios.get(requestUrl,{
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': '*',
            });
            console.log('取得成功: jsonデータはコンソールで確認できます。')
            res_json = response.data
            console.log(res_json)
            // Stateにjson文字列をsetする
            setJSONStr(JSON.stringify(res_json))
        } catch (error) {
            console.error(error)
            alert(error)
        }
    }

    // Stateから取ったjson文字列を再度jsonにしてパース
    const parseJSON = () =>{
        var list = []
        // JSONResultStrは最初空なので空リストを返す
        if(JSONResultStr == ''){
            //console.log("current-json-value<string>:"+JSONResultStr)
            list = [""]
        }
        // 該当ユーザーが見つからない場合空のjson配列が返ってくるので
        else if(JSONResultStr == '[]'){
            list = ["404:該当するユーザーは見つかりませんでした。"];
        }
        else{
            //console.log("current-json-value<string>:"+JSONResultStr)
            const json = JSON.parse(JSONResultStr)
            for(var i = 0; i < json.length; i++){
                const idToQueryPath = "/matching/user?id=" + json[i].id
                list.push(
                // listでDOM操作を仮で行ってます
                <div>
                    <Grid item xs={12} className="matchedUserItem" >
                    <p>{json[i].nickname}</p>
                    {/*<p>user-id:{parsed[i].id}</p>*/}
                    <p><Link to={idToQueryPath}>プロフィールへ</Link></p>
                    </Grid>
                </div>
                )
            }
        }
        return list
    }

    // gametag
    const haveSkillTags = [
        { label: "ApexLegends" },
        { label: "Valorant" },
        { label: "Splatoon" },
        { label: "Other" },
    ];

    const wantSkillTags = [
        { label: "ApexLegends" },
        { label: "Valorant" },
        { label: "Splatoon" },
        { label: "Other" },
      ];
    // マッチング機能はLambda + APIゲートウェイから呼び出しで行く
    return(
        <div className='matchingform'>
        {/*<h1>UserID取得テスト:{currentUserID} これをDynamoDBへ</h1>*/}  
        <h2>マッチする人を検索する</h2>
        <Grid container justifyContent={'center'} columnGap={7}>
        {/*<Grid item>
          <Autocomplete
            disablePortal
            id="combo-box"
            options={haveSkillTags}
            sx={{ width: 200, pt: 10, flex: 1, flexGrow: 1 }}
            renderInput={
                (params) => 
                <TextField {...params} 
                label="教えたい技術があるゲーム"
                onChange={haveSkillHandler}     
            />}
          />
        </Grid>

        <Grid item>
          <Autocomplete
            disablePortal
            id="combo-box"
            options={wantSkillTags}
            sx={{ width: 200, pt: 10, flex: 1, flexGrow: 1 }}
            renderInput={(params) => (
              <TextField {...params} 
              label="教わりたい技術があるゲーム" 
              onChange={wantSkillHandler}
              />
            )}
          />
            </Grid>*/}
        <TextField
            name="taskName"
            label="教えたい技術"
            sx={{ display: "flex", maxWidth: 360 }}
            helperText="あなたがマッチング相手に教えたい技術を入力"
            onChange={haveSkillHandler}
            />
           <TextField
           name="taskName"
           label="教わりたい技術"
           sx={{ display: "flex", maxWidth: 360 }}
           helperText="あなたがマッチング相手に教わりたい技術を入力"
           onChange={wantSkillHandler}
           />
        <Button
           variant="contained"
           color="primary"
           style={{height: 55}}
           onClick={handleCallAPI}
           >検索
        </Button>
           {/* <TextField
            name="taskName"
            label="教えたい技術"
            sx={{ display: "flex", maxWidth: 360 }}
            helperText="あなたがマッチング相手に教えたい技術を入力"
            onChange={haveSkillHandler}
            />
           <TextField
           name="taskName"
           label="教わりたい技術"
           sx={{ display: "flex", maxWidth: 360 }}
           helperText="あなたがマッチング相手に教わりたい技術を入力"
           onChange={wantSkillHandler}
           />
           <Button
           variant="contained"
           color="primary"
           style={{height: 55}}
           onClick={handleCallAPI}
           >検索
           </Button>*/}
        </Grid>
        <hr></hr>  
        <h2>検索結果(この下に表示されます)</h2>

        <Grid container justifyContent={'center'} columnGap={5} className='matchedUserContainer'>
            {parseJSON()}
        </Grid>
        </div>
    )
}

/**
 * <div className='matchingform'>
        {/*<h1>UserID取得テスト:{currentUserID} これをDynamoDBへ</h1>*  
        <h1>マッチしたユーザー表示</h1>
        教えたい技術
        <input type="text" placeholder="haveSkill" onChange={haveSkillHandler} /><br></br>
        教わりたい技術
        <input type="text" placeholder="wantSkil" onChange={wantSkillHandler}/><br></br>
        <button onClick={handleCallAPI}>さがす</button>
        <h2>マッチ結果</h2>
        {parseJSON()}
    </div>
 * 
 */

export default Matching