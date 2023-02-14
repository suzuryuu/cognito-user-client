//postで値取得する前までの処理は完成

const AWS = require('aws-sdk')
const docClient = new AWS.DynamoDB.DocumentClient({
    region: "ap-northeast-1"
})

exports.handler = async (event) => {
    
    console.log(event.body)
    
    // ユーザーID、haveSkill、wantSkill をpostでbodyでとる
    // haveSkill：教えたい技術　wantSkill：教わりたい技術
    
    const jsonParseConvert = JSON.parse(event.body);
    
    //使用するテーブル
    var table = 'User'
    
    //ユーザーID
    //var user_id = 'test-id-value-00'
    var user_id = jsonParseConvert.uid
    
    // // //ニックネーム
    var nick_name = jsonParseConvert.nickname
    
    // 変更するintroの値
    var intro   = jsonParseConvert.intro
    
    // 変更するhaveSkillの値
    var have_skill   = jsonParseConvert.haveSkill
    
    // 変更するwantSkillの値
    var want_skill   = jsonParseConvert.wantSkill
    
    // 変更するpictureの値
    var picture   = jsonParseConvert.picture
    
    //変更するthumbnailの値
    var thumbnail   = jsonParseConvert.thumbnail
    // var thumbnail = "test_thumbnail"

    
    var params = {
        "TableName": table,
        "Key":{
            "id": user_id
        },
        "ExpressionAttributeValues": {
            ":change_nickName": nick_name,
            ":change_intro" : intro,
            ":change_haveSkill": have_skill,
            ":change_wantSkill": want_skill,
            ":change_picture": picture,
            ":change_thumbnail" : thumbnail,
        },
        "UpdateExpression" :
        "set nickname = :change_nickName, intro = :change_intro, haveSkill = :change_haveSkill, wantSkill = :change_wantSkill, picture = :change_picture, thumbnail = :change_thumbnail",
        "ReturnValues" : "UPDATED_NEW"
    }
    
    
    
     // レスポンスを設定する
     var Result = await docClient.update(params, function(err, data){
        if(err){
            console.log('データー更新失敗')
            console.log(err)
        }else{
            console.log("データ更新:dynamoDBを確認してください")
            console.log(typeof obj)
        }
    }).promise()
    
    var items = "items"
    if(Result != null){
        items = Result.Items;
    }
    const response = {
        statusCode: 200,
        headers:{
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'OPTIONS,POST,GET',
            'Access-Control-Allow-Credentials' : true
        },
        body: JSON.stringify([
            {
                "updated_Profile"   :   "プロフィールを編集しました。",
                "名前"              :   nick_name,
                "自己紹介"          :   intro,
                "教えたい技術"      :   have_skill,
                "教わりたい技術"    :   want_skill,
                "サムネイル画像"    :   thumbnail,
                "プロフィール画像"  :   picture,
            }]),

    }
    return response;
    
};
