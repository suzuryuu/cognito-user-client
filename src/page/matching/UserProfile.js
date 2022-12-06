
// TODO:自分のプロフィールはMyProfile.js的なものにする
import React from 'react'
import '../../App.css'
import { useLocation } from 'react-router-dom'

const MatchedUserProfile = () =>{
    const search = useLocation().search
    const query = new URLSearchParams(search)
    const id = query.get('id')
    return(
        <div className="matcheduser">
            <p>クエリパラムからの値取得テスト:{id}</p>
        </div>
    );
}
export default MatchedUserProfile