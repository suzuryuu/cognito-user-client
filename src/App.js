import React from 'react'
import './App.css'

import { BrowserRouter, Link, Route, Switch, Routes, useLocation} from 'react-router-dom';

// components
import Title from './page/Title'
import SignUp from './page/auth/SignUp'
import Verification from './page/auth/Verification'
import SignIn from './page/auth/SignIn'
import Signed from './page/auth/Signed'

import Matchin from './page/matching/Matching'
import MatchResult from './page/matching/MatchingResult'
import UserProfile  from './page/matching/UserProfile';
import NormalUserProfile from './page/user/UserProfile';
import Header from './page/common/Header'

import { CognitoUserPool } from "amazon-cognito-identity-js"
import awsConfiguration from './conf/awsauth'
import RequestIndex from './page/crequest/RequestIndex';
import MyRequestIndex from './page/crequest/MyRequestIndex';
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
      return (
        <BrowserRouter>
        <Header />
        <Routes>
          <Route index element={<Signed/>}/>
          <Route path='/matching' element={<Matchin/>}/>
          {/*<Route path='/matching/result' element={<MatchResult/>}/>*/}
          <Route path='/matching/user' element={<UserProfile/>}/>
          <Route path='/user' element={<NormalUserProfile/>}/>
          <Route path='/requests' element={<RequestIndex/>}/>
          <Route path='/requests/yourself' element={<MyRequestIndex/>}/>
        </Routes>
        </BrowserRouter>
      )
    } else {
      return (
      <BrowserRouter>
       <div className="unauthorizedMode">
        <Routes>
        <Route index element={<Title />} />
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