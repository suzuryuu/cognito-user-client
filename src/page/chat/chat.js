import React,{ useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import axios from 'axios'
import apigatewayConf from '../../conf/apigateway'
import currentUser from '../common/getCurrentUser'

const ChatWithMatchedUser = () =>{
    const search = useLocation().search
    const query = new URLSearchParams(search)
    const id = query.get('mid')

    var [JSONResultStr, setJSONStr] = React.useState('')
    var [chatView, setChatView] = React.useState([])
    //const [userid, setUserId] = React.useState('')
    //const [name, setNickName]  = React.useState('') 
    const [message, setMessage] = React.useState('')
    
    const changedMessageHanldler = (e) => setMessage(e.target.value)
    //chatView = "This is initial view"
    // APIから得たチャット一覧だと仮定する
    var mList = []

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
    
    // レスポンスで使うデータ
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

    const UpDateView = () =>{
        try{
            var json = "";
            for(var i = 0; i< json.length; i++){
                // mList.push ( jsonの要素 ) マッチング相手の一覧表示の時をイメージする
            }
            setChatView(mList)
        }catch(e){
            alert("更新失敗")
            alert(e)
        }
    }
    const PostChatMessage = () =>{
        mList.push(
            <p>nickname:{nickname}</p>,
            <p>id:{userID}</p>,
            <p>mesage: {message}</p>
        )
    }

    const OnClickUpdateChat = () =>{
        UpDateView()
        PostChatMessage()
    }
    return(
        <div className="chatwithmatchuser">
            <p>マッチング相手をqueryより取る:{id}</p>
            <p>{chatView}</p>
            <p>画面</p>
            <input type="text"
            value={message}
            onChange={changedMessageHanldler}
            ></input>
            <button onClick={OnClickUpdateChat}>チャット</button>
        </div>
    )
}

export default ChatWithMatchedUser
