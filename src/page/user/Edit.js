import React, { useState } from "react";
import axios from "axios";
import Avatar from "react-avatar-edit";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import img from "../../style/user.jpg";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import awsConfiguration from "../../conf/awsauth";
import apigatewayConf from "../../conf/apigateway";
import { CognitoUserPool } from "amazon-cognito-identity-js";
import { useEffect } from "react";
import { Link } from 'react-router-dom';

const userPool = new CognitoUserPool({
    UserPoolId: awsConfiguration.UserPoolId,
    ClientId: awsConfiguration.ClientId,
})
const cognitoUser = userPool.getCurrentUser()
var currentUserID = 'User-ID-Value-From-Cognito' // 値を代入したいのでvarで定義
// 認証してる状態じゃないと取得できないので
if (cognitoUser != null) {
    currentUserID = cognitoUser.getUsername() //認証要素をemailにして名前をnicknameでとってるからidがここにある
} 

export default function Edit() {
  /*プロフィール画像処理*/
  const [imagecrop, setimagecrop] = useState("");
  const [src] = useState(false);
  const [profile, setprofile] = useState([]);
  const [pview, setpview] = useState(false);

  /*サムネイル画像処理*/
  const [thumbnail_imagecrop, setthumbnail_imagecrop] = useState("");
  const [thumbnail_src] = useState(false);
  const [thumbnail_profile, setthumbnail_profile] = useState([]);
  const [thumbnail_pview, setthumbnail_pview] = useState(false);

  const profileFinal = profile.map((item) => item.pview);

    //マウント時に初期プロフィール画像を設定
    useEffect(() => {
      // Update the document title using the browser API
      setpview(
        img
      );
  
    },[]);
  // 入力欄に現在の名前を表示してみる
  var [JSONResultStr, setJSONStr] = React.useState('')

  const API_ENDPOINT = apigatewayConf.END_POINT_URL
  const matchingRoute = '/dev/users'
  const queryParam = "?userid="+currentUserID;
  const requestUrl = API_ENDPOINT + matchingRoute + queryParam

  // ページのレンダでAPIリクエストを送る場合はuseEffectを使用する

  useEffect(() => {
      axios.get(requestUrl, {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': '*',
      }).then((res) => {
        // console.log("画像データ"+ res.data[0].picture)
        setpview(
          res.data[0].picture
        )
        values.nickname = res.data[0].nickname
        values.intro = res.data[0].intro
        values.haveSkill = res.data[0].haveSkill
        values.wantSkill = res.data[0].wantSkill
        values.picture = res.data[0].picture
        values.thumbnail = res.data[0].thumbnail
        console.log(values)
          console.log("データ取得成功")
      }).catch((e)=>{
          // 基本問題ないのになぜかエラー起きる(APIリクエストを送るのが非同期だから)
          alert('データ取得エラー')
      })
  }, [])

  var json = ""
  var nickname = ""
  var userID = ""
  var haveSkill = ""
  var wantSkill = ""
  var intro = ""
  if (JSONResultStr == '[]') {
      // 取得データが空の時
      nickname = "IDが該当するユーザー見つかりませんでした"
  }else if (!JSONResultStr == '') {
      json = JSON.parse(JSONResultStr)
      nickname = json[0].nickname
      userID = json[0].id
      haveSkill = json[0].haveSkill
      wantSkill = json[0].wantSkill
      intro = json[0].intro
  }
  const onClose = () => {
    setpview(null);
  };

  const onCrop = (view) => {
    setpview(view);
  };

  /*受け取り画像処理*/
  const saveCropImage = () => {
    if (pview != pview) {
      setprofile([...profile, { pview }]);
    } else {
      setimagecrop(false);
    }
  };

  /*タグの一覧 変更する場合はここから*/
  const tag = [
    { label: "ApexLegends" },
    { label: "Splatoon3" },
    { label: "Valorant" },
    { label: "League of Legends" },
  ];

  // 値を変更した時にvalueに一時保存
  const [values, setValues] = React.useState({
    uid : currentUserID,
    nickname : '',
    intro : '',
    haveSkill : '',
    wantSkill : '',
    picture : '',
    thumbnail : '',
  });

  //nicknameの値を更新
  const handleChange_nick = nickname => event => {
    setValues({ ...values, [nickname]: event.target.value });
  };

  //introの値を更新
  const handleChange_intro = intro => event => {
    setValues({ ...values, [intro]: event.target.value });
  };

  //haveSkillの値の更新
  const [inputValue_have, setInputValue_have] = React.useState('');

  //wantSkillの値の更新
  const [inputValue_want, setInputValue_want] = React.useState('');


  //　APIで編集結果を送信
  const onClickGetAPI = async() => {
    //pictureにプレビューした画像のバイナリを格納
    values.picture = pview
    values.thumbnail = "アイコン"

    console.log(values)
    const URL = apigatewayConf.EDIT_END_POINT + "/deploy0_0/send"
    
    try {
        const response = await axios.post(URL,values,
        {
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': apigatewayConf.API_KEY
          }
        });
        console.log(response.data)
        alert('編集内容を保存しました。')
        window.location.href = "/profile"
    } catch (error) {
        console.error(error)
        alert('リクエスト処理に失敗しました')
      }
    }

   // Link toがBox内のボタンだと効かないので 
   const onClickMoveToDelete = () =>{
    window.location.href = "/user/delete" 
   } 
  return (
    <Box>
      <p>アカウント情報編集</p>
      {/*<Button
        variant="outlined"
        color="primary"
        style={{
          width: "60px",
          height: "50px",
        }}
        label="戻る"
      />*/}
    
      {/*全体位置指定*/}
      <Grid
        container
        direction="column"
        justifyContent="center"
        alignItems="center"
      >
        <Grid>
          {/*画像位置*/}
          <img
            style={{
              width: "200px",
              height: "200px",
              borderRadius: "50%",
              objectFit: "cover",
            }}
            onClick={() => setimagecrop(true)}
            /*初期画像*/
            src={profileFinal.length ? profileFinal : pview}
            alt=""
          />

          <Dialog
            visible={imagecrop}
            header={() => <p>プロフィール画像選択</p>}
            onHide={() => setimagecrop(false)} 
          >
            <Button onHide={() => setimagecrop(false)} label="cansel"/> {/*キャンセルボタン*/}
            <Button onClick={saveCropImage} label="save" icon="pi pi-check" />{/*保存ボタン*/}
            <Avatar
              width={500}
              height={400}
              onCrop={onCrop}
              onClose={onClose}
              src={src}
              shadingColor={"#474649"}
              backgroundColor={"#474649"}
            />
          </Dialog>
        </Grid>
       
        <Grid>
          <TextField
            id="standard-textarea"
            label="名前"
            placeholder={nickname}
            multiline
            variant="standard"
            onChange={handleChange_nick('nickname')}
          />
        </Grid>

        <Grid>
          <TextField
            id="standard-textarea"
            label="自己紹介"
            placeholder={intro}
            multiline
            variant="standard"
            onChange={handleChange_intro('intro')}
          />
        </Grid>

        <Grid item xs={5} sm={8} pt={5}>
          教えたい技術
          <Autocomplete
            disablePortal
            id="combo-box-demo"
            options={tag}
            sx={{ width: 300 }}
            renderInput={(params) => <TextField {...params} label="Teaching" />}
            
            //onInputChangeでvaluesにhaveSkillの値を一時的に保存する
            inputValue_have={inputValue_have}
            value={values.haveSkill}

            onInputChange={(event, newInputValue) => {
              console.log(newInputValue)
              setInputValue_have(newInputValue)
              setValues({ ...values, haveSkill: newInputValue});
            }}

          />
        </Grid>

        
        <Grid item xs={5} sm={8} pt={5}>
          教わりたい技術
          <Autocomplete
            disablePortal
            id="combo-box-demo2"
            options={tag}
            sx={{ width: 300 }}
            renderInput={(params) => <TextField {...params} label="coaching" />}
            
            //onInputChangeでvaluesにwantSkillの値を一時的に保存する
            inputValue_want={inputValue_want}
            value={values.wantSkill}
            onInputChange={(event, newInputValue) => {
              console.log(newInputValue)
              setInputValue_want(newInputValue)
              setValues({...values, wantSkill: newInputValue});
            }}
          />
        </Grid>
        
        <Grid container justifyContent={'center'} columnGap={3} style={{paddingTop:25}}>
        <Button
           variant="contained"
           color="primary"
           style={{height: 100, width: 180}}
           onClick={onClickGetAPI}
           >保存
        </Button>
        <Button
           variant="contained"
           color="primary"
           style={{height: 100, width: 180,}}
           onClick={onClickMoveToDelete}
           >退会する
        </Button>
        </Grid>
      </Grid>
    </Box>
  );
}