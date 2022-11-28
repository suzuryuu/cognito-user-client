import React from 'react'
import '../../App.css'
import '../../style/auth.css'
import { Link } from 'react-router-dom';

import {
  CognitoUserPool,
  CognitoUser
} from "amazon-cognito-identity-js"
import awsConfiguration from '../../conf/awsauth'

const userPool = new CognitoUserPool({
  UserPoolId: awsConfiguration.UserPoolId,
  ClientId: awsConfiguration.ClientId,
})

const Verification = () => {
  const [email, setEmail] = React.useState('')
  const [verificationCode, setVerificationCode] = React.useState('')
  const changedEmailHandler = (event) => setEmail(event.target.value)
  const changedVerificationCodeHandler = (event) => setVerificationCode(event.target.value)

  const verifyCode = () => {
    const cognitoUser = new CognitoUser({
      Username: email,
      Pool: userPool
    })
    cognitoUser.confirmRegistration(verificationCode, true, (err) => {
      if (err) {
        alert(err)
        console.log(err)
        return
      }else{
        // 登録完了したら、のとこ。とりあえずアラート出してる
        alert('ユーザー登録が完了しました。')
        window.location.href = "/signin"
      }
      console.log('verification succeeded')
      setEmail('')
      setVerificationCode('')
    })
  }

  const reVerifyCode = () => {
    const cognitoUser = new CognitoUser({
      Username: email,
      Pool: userPool
    })
    cognitoUser.resendConfirmationCode(function(err){
      if (err) {
        alert('emailの形式が正しくありません')
        console.log(err)
        return
      }else{
        // 登録完了したら、のとこ。とりあえずアラート出してる
        alert('確認コードを再送しました。')
      }
      setEmail('')
    })
  }
  // メールアドレスが正しくない形式でも確認コードを送信しようとする問題あり
  return (
    <div class="formContainer">
      <div class="verify">
      <h1>コード確認</h1>
        <div className="uiForm">
          <div className="formField">
            <label>コード</label>
          <input type="text" 
          placeholder="確認コード" 
          onChange={changedVerificationCodeHandler} />
            <label>メールアドレス</label>
          <input type="text" 
          placeholder='email' 
          onChange={changedEmailHandler} />
          <div class="buttonAjust">
          <button onClick={verifyCode}>確認</button>
          </div>

          <div class="padding"></div>
          <label>コード再送</label>
          <input type="text" 
          placeholder='email'
          onChange={changedEmailHandler} />
          <div class="buttonAjust">
          <button onClick={reVerifyCode}>再送</button>
          </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Verification