import React from 'react'
import './App.css'

import { BrowserRouter, Link, Route, Switch, Routes, useLocation} from 'react-router-dom';

// components
import SignUp from './page/auth/SignUp'
import Verification from './page/auth/Verification'
import SignIn from './page/auth/SignIn'
import Signed from './page/auth/Signed'

import Matchin from './page/matching/Matching'

import Header from './page/common/Header'

import { CognitoUserPool } from "amazon-cognito-identity-js"
import awsConfiguration from './conf/awsauth'

// mini TODO resetpassword実装

// 認証情報使用
const userPool = new CognitoUserPool({
  UserPoolId: awsConfiguration.UserPoolId,
  ClientId: awsConfiguration.ClientId,
})

// カスタム属性を取得するいれもの
var currentUserDataList = {}

const App = () => {

  const checkStatus = () => {
    console.log(userPool)
    console.log(localStorage)
  }

  const authentication = () => {
    const cognitoUser = userPool.getCurrentUser()
   
    if (cognitoUser) {
      /*var nickNameInfo = "";
      if(cognitoUser !=null){
        cognitoUser.getSession((err, session) => {
          if (err) {
            alert(err);
          } else {
            // ユーザの属性を取得
          cognitoUser.getUserAttributes((err, result) => {
              if (err) {
                alert(err);
              }
              // 取得した属性情報を連想配列に格納
              for (var i = 0; i < result.length; i++) {
                currentUserDataList[result[i].getName()] = result[i].getValue();
              }
              
              console.log(currentUserDataList)
            })  
          }  
        })
      }else{
        alert('user info not found')
      }*/
      return (
        <BrowserRouter>
        <Header />
        <Routes>
          <Route index element={<Signed/>}/>
          <Route path='/matching' element={<Matchin/>}/>
        </Routes>
        </BrowserRouter>
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