import React, { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import axios from 'axios'
import apigatewayConf from '../../conf/apigateway'
import currentUser from '../common/getCurrentUser'
import "../../style/Chat.css";

const ChatWithMatchedUser = () => {
    const search = useLocation().search
    const query = new URLSearchParams(search)
    const chatRoomId = query.get('id')
    // chat相手uid 
    const chatPartnerId = query.get('uid')

    // current user data json(str)
    var [JSONResultStr, setJSONStr] = React.useState('')
    // chat相手 user data json(str)
    var [JSONPartnerInfo, setPartnerInfo] = React.useState('')
    var [ChatJSONStr, setChatJSON] = React.useState('')
    const [message, setMessage] = React.useState('')

    const changedMessageHanldler = (e) => setMessage(e.target.value)
    //chatView = "This is initial view"
    // APIから得たチャット一覧だと仮定する

    const useUserInfo = async (useridType) => {
        const API_ENDPOINT = apigatewayConf.END_POINT_URL
        const matchingRoute = '/dev/users'
        var queryParam = '?userid=' + currentUser.ID

        if (useridType == "current") {
            queryParam = '?userid=' + currentUser.ID
        } else if (useridType == "another") {
            queryParam = '?userid=' + chatPartnerId
        }

        const requestUrl = API_ENDPOINT + matchingRoute + queryParam

        // ページのレンダでAPIリクエストを送る場合はuseEffectを使用する
        useEffect(() => {
            axios.get(requestUrl, {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': '*',
            }).then((res) => {
                if (useridType == "current") {
                    setJSONStr(JSON.stringify(res.data))
                } else if (useridType == "another") {
                    setPartnerInfo(JSON.stringify(res.data))
                }
                console.log(res.data)
                console.log("データ取得成功")
            }).catch((e) => {
                console.log(e)
            })
        }, [])
    }

    // current userの情報を取る
    useUserInfo("current")
    // 他のユーザー(今回はチャット相手)の情報を取る
    useUserInfo("another")

    // レスポンスで使うデータ
    var json = ""
    var nickname = ""
    var userID = ""
    var picture = ""
    /*var haveSkill = ""
    var wantSkill = ""
    var intro = ""*/
    if (JSONResultStr == '[]') {
        // 取得データが空の時
        nickname = "IDが該当するユーザー見つかりませんでした"
    } else if (!JSONResultStr == '') {
        json = JSON.parse(JSONResultStr)
        nickname = json[0].nickname
        userID = json[0].id
        picture = json[0].picture
        /*haveSkill = json[0].haveSkill
        wantSkill = json[0].wantSkill
        intro = json[0].intro*/
    }

    // chat相手のレスポンスデータ(partnerの頭文字をとってる)
    var pJson = ""
    var pUID = ""
    var pNickname = ""
    var pPictureData = ""

    if (JSONPartnerInfo == '[]') {
        pNickname = "usr not found"
    } else if (!JSONPartnerInfo == '') {
        pJson = JSON.parse(JSONPartnerInfo)
        pNickname = pJson[0].nickname
        pUID = pJson[0].id
        pPictureData = pJson[0].picture
    }

    // チャットメッセージ一覧を読み込み時に取得する
    const useInitialChatView = async () => {
        const URL = apigatewayConf.END_POINT_URL + "/dev/chat/getchats?roomid=" + chatRoomId

        // ページのレンダでAPIリクエストを送る場合はuseEffectを使用する
        useEffect(() => {
            axios.get(URL,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'x-api-key': apigatewayConf.API_KEY
                    }
                }).then((res) => {
                    const jsonData = res.data
                    setChatJSON(JSON.stringify(jsonData))
                    console.log(jsonData)
                    console.log("データ取得成功")
                }).catch((e) => {
                    console.log(e)
                })
        }, [])
    }
    useInitialChatView()

    //jsonデータをパースしてListで返す
    const JSONparse = () => {
        var list = []
        // JSONResultStrは最初空なので空リストを返す
        if (ChatJSONStr == '') {
            //console.log("current-json-value<string>:"+JSONResultStr)
            list = [""]
        }
        // 該当ユーザーが見つからない場合空のjson配列が返ってくるので
        else if (ChatJSONStr == '[]') {
            list = [""];
        }
        else {
            //console.log("current-json-value<string>:"+JSONResultStr)
            const json = JSON.parse(ChatJSONStr)
            for (var i = 0; i < json.length; i++) {
                const idForDevideMessageColor = json[i].user_id;
                if (idForDevideMessageColor == currentUser.ID) {
                    list.push(
                        <div class="balloon_r">
                            <div class="faceicon">
                                <img src={picture}></img>
                            </div>
                            <p class="mysays">
                                {json[i].message}
                                <p style={{fontSize: 10, color: "white", paddingTop: 5, paddingLeft: 5}}>({json[i].created_at})</p>
                            </p>
                        </div>,
                        /*<p>投稿者:{json[i].nickname}({json[i].created_at})</p>,
                        <p>内容:{json[i].message}</p>,*/
                    )
                } else {
                    list.push(
                        <div class="balloon_l">
                            <div class="faceicon">
                                <img src={pPictureData} width="5%"></img> 
                            </div>
                            <p class="says">
                                {json[i].message}
                                <p style={{fontSize: 10, color: "gray", paddingTop: 5, paddingLeft: 5}}>({json[i].created_at})</p>
                            </p>
                        </div>,
                        /*<p>投稿者:{json[i].nickname}({json[i].created_at})</p>,
                        <p>内容:{json[i].message}</p>,*/
                    )
                }
            }
        }
        return list
    }


    // チャット投稿API呼び出し(これは動く)
    const PostChatMessage = async () => {
        // POSTで投稿するList型データ
        const valueForPostChat = {
            room_id: chatRoomId,
            nickname: nickname,
            uid: currentUser.ID,
            message: message
        }

        const URL = apigatewayConf.END_POINT_URL + "/dev/chat/create"

        try {
            const response = await axios.post(URL, valueForPostChat,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'x-api-key': apigatewayConf.API_KEY
                    }
                });
            console.log("チャットに投稿できました:")
            console.log(response.data)
            //alert('チャット投稿成功')
        } catch (error) {
            console.error(error)
            alert('リクエスト処理に失敗しました')
        }
    }

    const OnClickUpdateChat = () => {
        // 書き込みの後に更新を走らせたいので ReactHooksのルール的な感じで関数を入れることが出来ない？ので処理ごと書いてます
        // 投稿から0.3秒後に更新APIを呼ぶことにしました
        setTimeout(async () => {
            const URL = apigatewayConf.END_POINT_URL + "/dev/chat/getchats?roomid=" + chatRoomId

            try {
                const response = await axios.get(URL,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'x-api-key': apigatewayConf.API_KEY
                        }
                    });

                const jsonData = response.data
                console.log("書き込み処理の0.5秒あとに更新しました")
                console.log(jsonData)

                const json = JSON.stringify(jsonData)
                setChatJSON(json)
            } catch (error) {
                console.error(error)
                alert('リクエスト処理に失敗しました')
            }
            //return chatMessageList;

        }, 500);
        PostChatMessage()
    }

    return (
        <div className="chatwithmatchuser">
            <div class="center">
                <div class="title">
                    <img src={pPictureData} width="5%"></img> {pNickname}
                </div><br />
                {/*ユーザの名前*/}
                <div className="chatMessages">
                {JSONparse()}
                </div>
                {/*<div class="yohaku"></div>
                {/*入力場所*/}
            </div>
            {/** テキストボックスと送信ボタンをもう少しデザイン性が高いものにしてほしい */}
            <div className='chatBox'>
                <textarea value={message} onChange={changedMessageHanldler}></textarea>
                <button class="button" onClick={OnClickUpdateChat}>送信</button>
            </div>
            {/*<p>{JSONparse()}</p>
            <p>画面</p>
            <input type="text"
                value={message}
                onChange={changedMessageHanldler}
            ></input>
    <button onClick={OnClickUpdateChat}>送信</button>*/}
        </div>

    )
}

export default ChatWithMatchedUser
