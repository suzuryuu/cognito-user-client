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
        nickname: '',
        picture: '',
        star: '',
        content: ''
    })

    const useUserInfo = () => {

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
                values.nickname = res.data[0].nickname
                values.picture = res.data[0].picture
                console.log(res.data)
                console.log("データ取得成功")
            }).catch((e) => {
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
            window.location = "/user?id="+feedbackTargetUserId
        }
        catch (error) {
            console.error(error)
            //   alert("リクエスト処理に失敗しました")
        }
    }


    return (
        <div className='feedbackcontent'>
            <h2>評価ページ(ID:{feedbackTargetUserId})</h2>
            <div className="formContainer">
                <form onSubmit>
                    <div className="uiForm">
                        <Grid>
                            <h2>5段階評価(必須)</h2>
                            <ReactStars
                                count={5}
                                style={{ texiAlign: "center"}}
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
                                        style={{width: 400}}
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
