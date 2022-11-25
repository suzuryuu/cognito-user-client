import React from 'react'
import './App.css'

import { BrowserRouter, Link, Route, Switch, Routes, useLocation} from 'react-router-dom';

// components
import SignUp from './page/SignUp'
import Verification from './page/Verification'
import SignIn from './page/SignIn'
import SignOut from './page/SignOut'

import { CognitoUserPool } from "amazon-cognito-identity-js"
import awsConfiguration from './conf/awsauth'

// mini TODO resetpassword実装

// 認証情報使用
const userPool = new CognitoUserPool({
  UserPoolId: awsConfiguration.UserPoolId,
  ClientId: awsConfiguration.ClientId,
})

// カスタム属性を取得するいれもの
var currentUserData = {}
var i = 0;


const App = () => {

  const checkStatus = () => {
    console.log(userPool)
    console.log(localStorage)
  }

  const authentication = () => {
    const cognitoUser = userPool.getCurrentUser()
    //const username = cognitoUser.getUsername();
    /*const session = cognitoUser.getSession();
    const nickname = session.idToken.payload.nickname;*/
    // サインアウトボタンはとりあえず直置きしてます。
    if (cognitoUser) {
      return (
        <div className="authorizedMode">
          <h1>ログインしました(ここをホーム画面遷移とかにすればいい？)</h1>
          <SignOut />
        </div>
      )
    } else {
      return (
      <BrowserRouter>
       <div className="unauthorizedMode">
        <Routes>
        <Route index element={<SignUp />} />
        <Route path="/signup" element={<SignUp/>}/>
        <Route path="/signin" element={<SignIn/>}/>
        <Route path="/verify" element={<Verification/>}/>
        </Routes>
        </div>
      </BrowserRouter>
      )
    }
  }

  return (
    <div className="App">
      { authentication() }
    </div>
       
  )
}

export default App