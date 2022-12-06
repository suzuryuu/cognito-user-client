import React from 'react'
import '../../App.css'
import axios from 'axios'

import { CognitoUserPool } from "amazon-cognito-identity-js"
import awsConfiguration from '../../conf/awsauth'

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
const API_ENDPOINT = 'https://6c1o3159qj.execute-api.ap-northeast-1.amazonaws.com';

// haveSkill: 教えたい技術, wantSkill: 教わりたい技術
// userAにとってのhaveSkill -> userBのwantSkill,  A wantSkill -> B haveSkill
const Matching = () =>{
    const [haveSkill, setHaveSkill] = React.useState('')
    const [wantSkill, setWantSkill] = React.useState('')    

    const haveSkillHandler = (e) => setHaveSkill(e.target.value)
    const wantSkillHandler = (e) => setWantSkill(e.target.value)

    // マッチング機能はLambda + APIゲートウェイから呼び出しで行く
    const MatchResult = async()=>{
        // CORS対策
        axios.defaults.withCredentials = true;
        axios.defaults.baseURL = 'http://localhost:3000';
        

        const matchingRoute = '/dev/m-result'
        const query = '?wskill=' + wantSkill + '&hskill=' + haveSkill
        const requestUrl = API_ENDPOINT + matchingRoute + query
        
        try {
            const response = await axios.get(requestUrl,{
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': '*',
            });
            //alert(response.data);
            console.log(response.data);
        } catch (error) {
            console.error(error);
            alert(error);
        }
    }
    
    return(
    <div className='matchingform'>
     
     <h1>UserID取得テスト:{currentUserID} これをDynamoDBへ</h1>   
    <h1>マッチしたユーザー表示</h1>
    教えたい技術
    <input type="text" placeholder="haveSkill" onChange={haveSkillHandler} /><br></br>
    教わりたい技術
    <input type="text" placeholder="wantSkil" onChange={wantSkillHandler}/><br></br>
    <button onClick={MatchResult}>さがす</button>
    </div>
    )
}

export default Matching