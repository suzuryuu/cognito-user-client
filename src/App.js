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
import UserProfile  from './page/matching/UserProfile';
import NormalUserProfile from './page/user/UserProfile';
import MyProfile from './page/user/MyUserProfile';
import RequestedUserProfile from './page/crequest/UserProfile';
import Header from './page/common/Header'

import { CognitoUserPool } from "amazon-cognito-identity-js"
import awsConfiguration from './conf/awsauth'
import RequestIndex from './page/crequest/RequestIndex';
import MyRequestIndex from './page/crequest/MyRequestIndex';

import Matchinguser from './page/front-end-test/MatchingUser';
import Home from './page/front-end-test/TestIndex';
import Edit from './page/user/Edit';
import DeleteUsers from './page/user/DeleteUser';
import ChatWithMatchedUser from './page/chat/chat';
import PendingUserIndex from './page/crequest/pending/PendingIndex';
import TESTChat from './page/front-end-test/TESTchat';
import Footer from './page/common/Footer';
import TESTTITLE from './page/front-end-test/TitleTEST';
import TestHome from './page/front-end-test/TESTHome';
import Titleunder from './page/front-end-test/TestTitleUnder';
import UserFeedBackPage from './page/user/FeedBack';
import Tos from './page/common/Tos';

// mini TODO resetpassword実装

// 認証情報使用
const userPool = new CognitoUserPool({
  UserPoolId: awsConfiguration.UserPoolId,
  ClientId: awsConfiguration.ClientId,
})

// カスタム属性を取得するいれもの
var currentUserDataList = {}

const App = () => {

  /** const checkStatus = () => {
    console.log(userPool)
    console.log(localStorage)
  }*/
  // 認証・未認証で表示ページを分ける
  const authentication = () => {
    const cognitoUser = userPool.getCurrentUser()
  
    if (cognitoUser) {
      return (
        <BrowserRouter>
        <Header />
        <Routes>
          <Route index element={<Signed/>}/>
           {/** マッチング */}
          <Route path='/matching' element={<Matchin/>}/>
          <Route path='/matching/user' element={<UserProfile/>}/>
           {/** ユーザー */}
          <Route path='/user' element={<NormalUserProfile/>}/>
          <Route path='/user/delete' element={<DeleteUsers/>}/>
          <Route path='/user/fdback' element={<UserFeedBackPage/>}/>

           {/** アカウント */}
          <Route path='/profile' element={<MyProfile/>}/>
          <Route path='/profile/edit' element={<Edit/>}/>
           {/** コーチングリクエスト */}
          <Route path='/requests/user' element={<RequestedUserProfile/>}/>
          <Route path='/requests' element={<RequestIndex/>}/>
          <Route path='/requests/yourself' element={<MyRequestIndex/>}/>
          <Route path='/requests/pending' element={<PendingUserIndex/>}/>
          {/** チャット */}
          <Route path='/chat' element={<ChatWithMatchedUser/>}/>
          {/** フロントエンドテスト表示よう */}
          <Route path='/testmatchuser' element={<Matchinguser/>}/>
          <Route path='/testindex' element={<Home />}/>
          <Route path='/testChat' element={<TESTChat />}/>
          <Route path='/testHome' element={<TestHome />}/>
          <Route path='/testTitleUnder' element={<Titleunder />}/>
          <Route path='/testTitle' element={<TESTTITLE />}/>
          {/** 利用規約 */}
          <Route path="/userule" element={<Tos/>}/>
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
        <Route path="/userule" element={<Tos/>}/>
      
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