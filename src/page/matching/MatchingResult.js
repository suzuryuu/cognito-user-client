import React from 'react'
import '../../App.css'
import axios from 'axios'

import { CognitoUserPool } from "amazon-cognito-identity-js"
import awsConfiguration from '../../conf/awsauth'
import {useNavigate} from 'react-router-dom';
import { BrowserRouter, Link, Route, Switch, Routes, useLocation} from 'react-router-dom';
import { useContext } from 'react'

// json パースのテストページ
// API gatewayから取る
var json = [
    {"nickname":"HelloMan","email":"test@jc-22.jp","id":"test-id-value-00","haveSkill":"ApexLegends","wantSkill":"Valorant"},
    {"nickname":"GoodByeMan","email":"aaaa2@example.com","id":"test-id-value-03","haveSkill":"ApexLegends","wantSkill":"Valorant"}
]
const obj = JSON.stringify(json);

const parsed = JSON.parse(obj);

//var list = [];

const MacthedUsersComponent = () =>{
    var list = [];
    //const navigate = useNavigate()

    for(var i = 0; i < parsed.length; i++){
        const idToQueryPath = "/user?id=" + parsed[i].id
        list.push(
        <div>
            <p>{parsed[i].nickname}</p>
            {/*<p>user-id:{parsed[i].id}</p>*/}
            <p><Link to={idToQueryPath}>プロフィールへ</Link></p>
        </div>,
        );
        
        console.log("jsonからユーザー情報をパースするテスト")
        console.log("username:"+ parsed[i].nickname)
        console.log("email:"+ parsed[i].email)
        console.log("ID:"+parsed[i].id)
        console.log("haveSkill:"+parsed[i].haveSkill)
        console.log("wantSkill:"+parsed[i].wantSkill)
    }
    return list;
}

// idをクエリとして送る
// user?id=test-id-value-00みたいな感じでいいか
const MatchResult = () =>{
    //const res = useContext(JSONcontext);

    return(
        <div className="matchresult">
            <h1>マッチしたユーザー一覧</h1>
            <h2>{MacthedUsersComponent()}</h2><br></br>
        </div>
    );
}
export default MatchResult