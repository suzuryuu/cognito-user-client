import React from 'react'
import '../../App.css'
import { Link } from 'react-router-dom';

import { CognitoUserPool } from "amazon-cognito-identity-js"
import awsConfiguration from '../../conf/awsauth'
import Button from '@material-ui/core/Button'

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
      <div>
         <Button
           variant="contained"
           color="primary"
           style={{height: 100, width: 250}}
           onClick={signOut}
           >サインアウト
          </Button>
      </div>
  )
}

export default SignOut