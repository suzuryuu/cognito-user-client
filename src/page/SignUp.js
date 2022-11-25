import React from 'react'
import '../App.css'
import '../style/auth.css'
import { Link } from 'react-router-dom';

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
  // 規約同意bool 
  const [isChecked, setIsChecked] = React.useState(false);

  
  const toggleCheckbox = () => {
    setIsChecked(!isChecked)
  }
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
       // alert(password)
        alert(err)
        return
      }else{
        if(isChecked){
          // 登録がうまくいったら、のとこ。とりあえずアラート出してる
          alert('ユーザー情報を登録しました。メールより確認コードを確認してください。')
          window.location.href = "/verify"
        }else{
          alert('利用規約に同意してください。')
        }
      }
      setEmail('')
      setPassword('')
      setNickName('')
    })
  }

  return (
    <div className="formContainer"> 
    <div class="signup">
      <h1>新規ユーザ登録</h1>
      <hr />
      <div className="uiForm">
      <div className="formField">
        <label>メールアドレス</label>
          <input
            type="text"
            name="email"
            placeholder="メールアドレス"
            value={email}
            onChange={changedEmailHandler}
          />
        </div>
        <div className="formField">
        <label>ユーザー名</label>
          <input
            type="text"
            name="nickname"
            placeholder="ユーザー名"
            value={nickname}
            onChange={changedNickNameHandler}
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
        <div className="formField">
          <label>利用規約に同意する</label>
          <div className="check"><input
            type="checkbox"
            onChange={()=>toggleCheckbox()}
          />
        </div>
        </div>
        <div class="buttonAjust">
        <button onClick={signUp}>登録</button>
        </div>
        <p>アカウントをお持ちですか？:<Link to="/signin">ログイン</Link></p>
      </div>
    </div>
  </div>
    /*<div className="SignUp">
      <h1>あなたはまだ未認証状態です</h1>
      <h1>登録</h1>
      <input type="text" placeholder="email" onChange={changedEmailHandler} />
      <input type="text" placeholder="nickname" onChange={changedNickNameHandler}/> 
      <input type="text" placeholder="password" onChange={changedPasswordHandler} />
      <button onClick={signUp}>登録</button>
      <p>アカウントが既にある場合:<Link to="/signin">ログイン</Link></p>
    </div>*/
  )
}

export default SignUp