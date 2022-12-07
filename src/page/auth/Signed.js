import React from 'react'
import '../../App.css'
import { Link } from 'react-router-dom';
import SignOut from '../../page/auth/SignOut'
import Button from '@material-ui/core/Button'
import Grid from "@mui/material/Grid";

const Signed = () => {
  return (
    <div className="authorizedMode">
          <h1>ログインしました(ここをホーム画面遷移とかにすればいい？)</h1>
          <h2>ユーザー</h2>
          <Grid container justifyContent={'center'} columnGap={3}>
          <Button
           variant="contained"
           color="primary"
           style={{height: 100, width: 250}}
           component={Link}
           to="/matching"
           >マッチするユーザーを探す
           </Button>
           <SignOut />
          </Grid>
    </div>
  )
}

export default Signed