import React from 'react'
import '../App.css'
import { Link } from 'react-router-dom';

import { CognitoUserPool } from "amazon-cognito-identity-js"
import awsConfiguration from '../conf/awsauth'

const userPool = new CognitoUserPool({
  UserPoolId: awsConfiguration.UserPoolId,
  ClientId: awsConfiguration.ClientId,
})

const SignOut = () => {
  const signOut = () => {
    const cognitoUser = userPool.getCurrentUser()
    if (cognitoUser) {
      cognitoUser.signOut()
      // サインアウトしたらリロード
      window.location.href="/"
      localStorage.clear()
      console.log('signed out')
    } else {
      localStorage.clear()
      console.log('no user signing in')
    }
  }

  return (
    <div className="SignOut">
      <h1>サインアウト</h1>
      <button onClick={signOut}>サインアウト</button>
    </div>
  )
}

export default SignOut