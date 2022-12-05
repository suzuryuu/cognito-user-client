import React from 'react'
import '../../App.css'
import { Link } from 'react-router-dom';
import SignOut from '../../page/auth/SignOut'

const Signed = () => {
  return (
    <div className="authorizedMode">
        <div>
          <h1>ログインしました(ここをホーム画面遷移とかにすればいい？)</h1>
          <h2>ユーザー</h2>
          </div>
          <SignOut />
    </div>
  )
}

export default Signed