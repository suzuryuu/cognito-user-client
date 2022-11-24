import '../App.css'
import React from 'react';


import {
  CognitoUserPool,
  CognitoUser,
  AuthenticationDetails
} from "amazon-cognito-identity-js"
import awsConfiguration from '../conf/awsauth'

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

  return (
    <div className="SignIn">
      <h1>ログイン</h1>
      <input type="text" placeholder='email' onChange={changedEmailHaldler}/>
      <input type="text" placeholder='password' onChange={changedPasswordHandler}/>
      <button onClick={signIn}>ログイン</button>
    </div>
  )
}

export default SignIn