import '../../App.css'
import '../../style/auth.css';
import React from 'react';
import { Link } from 'react-router-dom';


import {
  CognitoUserPool,
  CognitoUser,
  AuthenticationDetails
} from "amazon-cognito-identity-js"
import awsConfiguration from '../../conf/awsauth'

const userPool = new CognitoUserPool({
  UserPoolId: awsConfiguration.UserPoolId,
  ClientId: awsConfiguration.ClientId,
})

const SignIn = () => {
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const changedEmailHaldler = (e) => setEmail(e.target.value)
  const changedPasswordHandler = (e) => setPassword(e.target.value)

  const signIn = () => {
    const authenticationDetails = new AuthenticationDetails({
      Username : email,
      Password : password
    })
    const cognitoUser = new CognitoUser({
      Username: email,
      Pool: userPool
    })

    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: (result) => {
        console.log('result: ' + result)
        const accessToken = result.getAccessToken().getJwtToken()
        console.log('AccessToken: ' + accessToken)
        setEmail('')
        setPassword('')
        // サインインが出来たらルートへ
        window.location.href="/"
      },
      onFailure: (err) => {
        console.error(err)
        alert(err)
      }
    })
  }

  const forgotPassword = () => {
    
  }
  return (
    <div className="formContainer">
    <div class="signin">
      <h1>ログイン</h1>
      <hr />
      <div className="uiForm">
        <div className="formField">
          <label>メールアドレス</label>
          <input
            type="text"
            name="email"
            placeholder="メールアドレス"
            value={email}
            onChange={changedEmailHaldler}
          />
        </div>
        <div className="formField">
          <label>パスワード</label>
          <input
            type="password"
            name="password"
            placeholder="パスワード"
            value={password}
            onChange={changedPasswordHandler}
          />
        </div>
        <div class="authFormButton">
          <button onClick={signIn}>ログイン</button>
        </div>
        <p>アカウントをお持ちでない場合:<Link to="/signup">登録</Link></p>
      </div>
    </div>
  </div>
    /*<div className="SignIn">
      <h1>ログイン</h1>
      <input type="text" placeholder='email' onChange={changedEmailHaldler}/>
      <input type="text" placeholder='password' onChange={changedPasswordHandler}/>
      <button onClick={signIn}>ログイン</button>
      <p>アカウントがない:<Link to="/signup">登録</Link></p>
      パスワードを忘れた場合のコード送信用<input type="text" placeholder='email' onChange={changedEmailHaldler}/>
      <button onClick={''}>コード要求</button>
  </div>*/
  )
}

export default SignIn