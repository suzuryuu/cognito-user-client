import React from 'react'
import '../App.css'

import {
  CognitoUserPool,
  CognitoUser
} from "amazon-cognito-identity-js"
import awsConfiguration from '../conf/awsauth'

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
        alert(err)
        console.log(err)
        return
      }else{
        // 登録完了したら、のとこ。とりあえずアラート出してる
        alert('確認コードを再送しました。')
      }
      setEmail('')
    })
  }


  return (
    <div className="Verification">
      <h1>コード確認</h1>
      <input type="text" placeholder="verification code" onChange={changedVerificationCodeHandler} />
      <input type="text" placeholder='email' onChange={changedEmailHandler} />
      <button onClick={verifyCode}>確認</button>
      <h1>コード再送</h1>
      <input type="text" placeholder='email' onChange={changedEmailHandler} /><button onClick={reVerifyCode}>再送</button>
    </div>
  )
}

export default Verification