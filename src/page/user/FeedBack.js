// TODO:自分のプロフィールはMyProfile.js的なものにする
import React from 'react'
import '../../App.css'
import { useLocation, useNavigate } from 'react-router-dom'
import apigatewatConf from '../../conf/apigateway'
import { useEffect, useState } from 'react'

import axios from 'axios'
import { paste } from '@testing-library/user-event/dist/paste'

import { Button } from "primereact/button";
// S3とか使って好きなアイコン設定できるようにする？
import img from "../../style/user.jpg";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import ReactStars from "react-rating-stars-component";
import '../../style/matching.css'
import '../../style/reqIndex.css'
import { Link } from 'react-router-dom';
//import { FormControl, InputLabel, Select, MenuItem } from '@material-ui/core'
const FeedBack = () => {
    const search = useLocation().search
    const query = new URLSearchParams(search)
    const id = query.get('uid')

    return (
        <div className="feedbackcontent">
            <p>評価ページ({id})</p>
            <Box>
                {/*全体位置指定*/}
                <Grid
                    container
                    direction="column"
                    justifyContent="center"
                    alignItems="center">
                </Grid>
                <Grid style={{ paddingBottom: 40 }}>
                    <p>5段階評価</p>
                <select name="5valFeedback" >
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                </select>
                </Grid>
                <Grid>
                    <TextField
                        className='feedbackform'
                        multiline
                        minRows={8}
                        style={{ backgroundColor: "white", width: 400 }}>
                    </TextField>
                </Grid>
                <Grid style={{ paddingTop: 40 }}>
                    <Button
                        style={{
                            width: "300px",
                            height: "50px",
                        }}
                        label="評価を送信する"
                        onClick={'onclickpost~'}
                    />
                </Grid>
            </Box>
        </div>
    )
}

export default FeedBack