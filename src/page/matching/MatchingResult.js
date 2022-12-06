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

// API gatewayから取る
var json = [
    {"nickname":"HelloMan","email":"test@jc-22.jp","id":"test-id-value-00","haveSkill":"ApexLegends","wantSkill":"Valorant"},
    {"nickname":"GoodByeMan","email":"aaaa2@example.com","id":"test-id-value-03","haveSkill":"ApexLegends","wantSkill":"Valorant"}
]
const obj = JSON.stringify(json);

const parsed = JSON.parse(obj);

var list = [];

for(var i = 0; i < parsed.length; i++){
  
    list.push(
    <div>
        <p>ユーザー名:{parsed[i].nickname}</p>
        {/*<p>user-id:{parsed[i].id}</p>*/}
        <a href='#'>プロフィールへ</a>
    </div>
    );
    
    console.log("jsonからユーザー情報をパースするテスト")
    console.log("username:"+ parsed[i].nickname)
    console.log("email:"+ parsed[i].email)
    console.log("ID:"+parsed[i].id)
    console.log("haveSkill:"+parsed[i].haveSkill)
    console.log("wantSkill:"+parsed[i].wantSkill)
}
const MatchResult = () =>{
    return(
        <div className="matchresult">
            <h1>マッチしたユーザー一覧</h1>
            <h2>{list}</h2><br></br>
        </div>
    );
}
export default MatchResult