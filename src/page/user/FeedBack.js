import '../../style/feedback.css';
import Grid from "@mui/material/Grid";
import React, { } from 'react';
import ReactStars from "react-rating-stars-component";
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { Feedback } from '@mui/icons-material';
import currentUser from '../common/getCurrentUser';
import { useLocation } from 'react-router-dom';
import { APIGateway } from 'aws-sdk';
import apigatewayConf from '../../conf/apigateway';
import axios from 'axios';
import { useEffect } from 'react';


export default function UserFeedBackPage() {
    var [JSONResultStr, setJSONStr] = React.useState('')

    const useUserInfo = () =>{

        const API_ENDPOINT = apigatewayConf.END_POINT_URL
        const matchingRoute = '/dev/users'
        const queryParam = '?userid=' + currentUser.ID;
        const requestUrl = API_ENDPOINT + matchingRoute + queryParam
    
        // ページのレンダでAPIリクエストを送る場合はuseEffectを使用する
        useEffect(() => {
            axios.get(requestUrl, {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': '*',
            }).then((res) => {
                setJSONStr(JSON.stringify(res.data))
                console.log(res.data)
                console.log("データ取得成功")
            }).catch((e)=>{
                console.log(e)
            })
        }, [])
    }

    useUserInfo()
    /*
    編集処理
    const onClose = () => {
      setpview(null);
    };
  
    const onCrop = (view) => {
      setpview(view);
    };
  
    const saveCropImage = () => {
      if (pview != pview) {
        setprofile([...profile, { pview }]);
      } else {
        setimagecrop(false);
      }
    }*/
    // userにかかわる情報
    

    var json = ""
    var name = ""
    var picturedata = ""
    var usrvalue = []

    if (JSONResultStr == '[]') {
        // 取得データが空の時
       console.log("value empty error")
    }else if(JSONResultStr == ''){
       console.log("value empty error")
    }else{
        json = JSON.parse(JSONResultStr)
        name = json[0].nickname
        picturedata = json[0].picture
        usrvalue.push(name)
    }
     
    // 評価対象者のidはクエリでとることに
    const search = useLocation().search
    const query = new URLSearchParams(search)
    const feedbackTargetUserId = query.get('id')

    // 値を変更した時にvalueに一時保存
    // nicknameと画像のデータ持たせたいけど空になる
    const [values, setValues] = React.useState({
        // uid : crrentUserID,
        userid: feedbackTargetUserId,
        fuid: currentUser.ID,
        nickname: name,
        picture: picturedata,
        star: '',
        content: ''
    })

    // starデータ取得部分
    const ratingChanged = newValue => {
        values.star = String(newValue)
        console.log(values.star)
    };

    // content
    const evalute_commentChanged = content => event => {
        setValues({ ...values, [content]: event.target.value });
    };

    //送信ボタンで評価を送信
    const onClickgetAPI = async () => {
        console.log("test")
        console.log(values)
        const URL = apigatewayConf.END_POINT_URL + "/dev/users/feedback/post"
        try {
            const response = await axios.post(URL, values,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'x-api-key': apigatewayConf.API_KEY
                    }
                });
            console.log("評価の投稿に成功しました。")
            console.log(response.data)
            // ユーザープロフィールにリダイレクトする
        }
        catch (error) {
            console.error(error)
            //   alert("リクエスト処理に失敗しました")
        }
    }


    return (
        <div className='feedbackcontent'>
            test my nickname{name}
            test my picture data {picturedata}
            <div className="formContainer">
                <form onSubmit>
                    <h1>評価(ID:{feedbackTargetUserId})</h1>
                    <div className="uiForm">
                        <Grid>
                            <h2>5段階評価(必須)</h2>
                            <ReactStars
                                count={5}
                                onChange={ratingChanged}
                                size={24}
                            />
                            <br />
                            評価コメント(任意)
                            <Box>
                                <div>
                                    <TextField
                                        id="outlined-multiline-static"
                                        multiline
                                        rows={8}
                                        onChange={evalute_commentChanged('content')}
                                    />
                                </div>
                            </Box>
                            <br></br>
                            {/* 評価を送信 */}
                            <Button
                                variant="contained"
                                color="warning"
                                onClick={onClickgetAPI}
                            >
                                送信
                            </Button>
                        </Grid>
                        <div className="formField">
                        </div>
                        <p className="errorMsg"></p>
                        <div className="formField">

                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
