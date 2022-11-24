import React from 'react'
import '../App.css'

import {
  CognitoUserPool,
  CognitoUserAttribute
} from "amazon-cognito-identity-js"
import awsConfiguration from '../conf/awsauth';

const userPool = new CognitoUserPool({
  UserPoolId: awsConfiguration.UserPoolId,
  ClientId: awsConfiguration.ClientId,
})
// custom属性にnickname追加
const SignUp = () => {
  const [email, setEmail] = React.useState('')
  const [nickname, setNickName] = React.useState('')
  const [password, setPassword] = React.useState('')

  const changedEmailHandler = (event) => setEmail(event.target.value)
  const changedNickNameHandler = (event) => setNickName(event.target.value)
  const changedPasswordHandler = (event) => setPassword(event.target.value)

  // email, passwordがデフォの必須属性
  // カスタム属性はattributeListの中へ
  const signUp = () => {
    const attributeList = [
      new CognitoUserAttribute({
        Name: 'nickname',
        Value: nickname
      })
    ]
    userPool.signUp(email, password, attributeList, [], (err, result) => {
      if (err) {
        console.error(err)
        alert(err)
        return
      }else{
        // 登録がうまくいったら、のとこ。とりあえずアラート出してる
        alert('ユーザー情報を登録しました。メールより確認コードを確認してください。')
      }
      setEmail('')
      setPassword('')
      setNickName('')
    })
  }

  return (
    <div className="SignUp">
      <h1>登録</h1>
      <input type="text" placeholder="email" onChange={changedEmailHandler} />
      <input type="text" placeholder="nickname" onChange={changedNickNameHandler}/> 
      <input type="text" placeholder="password" onChange={changedPasswordHandler} />
      <button onClick={signUp}>登録</button>
    </div>
  )
}

export default SignUp