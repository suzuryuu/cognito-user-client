# これは何か
卒業制作webアプリケーション「Mu-Tech」のReactクライアントです

ゲームスキルの相互コーチングを行うサービスとなっています。

README作成者: 福島
# 出来てること
## ユーザー関係
Cognito利用で
- 新規登録
- コード確認、再送
- ログイン(この時DynamoのUserテーブルにidとemail,default iconが保存される)
- ユーザー情報編集機能(名前、自己紹介、教えたい技術、教わりたい技術、アイコン)
- ユーザーの評価機能(☆(5段階)とコメント)
- ログアウト
- ユーザー退会機能(cognito, dynamo共に削除)

## マッチング
- 条件に合致したユーザーを検索し表示
- リクエストを送ろうか迷うユーザーの保留、その削除
- リクエストの通知と来ているリクエストの一覧の表示
- 自分が送ったリクエストの一覧とその状態表示
- コーチングリクエストの送信
- コーチングリクエストの通知・一覧表示
- リクエストの承認・拒否。承認してる場合はDMへのリンク表示。拒否している場合はリクエストモデルが削除される。
- 自分が送ったコーチングリクエストの一覧表示
- マッチングが成立した際のチャット風掲示板の実装
- コーチング終了時のリクエスト削除(送り主側)


※AWS Lambdaの関数自体ではサービスを成立させるための機能は実装済みです。

## 出来ていないこと
- コーチングした人同士だけで評価できるようにする(現状誰でも評価ができる。それでも問題ないけど、コーチングを行っていないのに虚偽評価を行うリスクを防げない)
- マッチングの履歴を取る
- 評価機能の☆の必須化、入力してないときのエラーハンドハンドリングが出来てない(F12コンソールでhttpリクエストのエラーは確認できる)

- 通報機能(以下やる場合のやり方)

1. そのユーザーの通報ボタンを押すと通報テーブルに被通報者と通報者のidがポストされる

2. dynamoDBの管理画面で被通報者の通報された回数(idのカウント)が一定数(10件以上)確認できたらcognitoユーザー管理で無効化

3. 無効化は悪意ある通報の可能性も考えて敢えて手動でやる


通報テーブルの構造
```
reported_uid (被通報者, パーティションキー)
reporter_uid  (通報者, ソートキー)
```

履歴系でもしやるなら
```
評価する人をコーチングを行った人のみするしくみ

history テーブル
- userid(partition key)
- matcheduserid(sortkey)

if userid == "評価対象者" and if matheduserid == currentUser.ID

評価できる

else

出来ないことを伝える処理(alert, リダイレクトなど)
```


# 起動
依存関係を入れる
※仕様SDKをAmplify sdkからcognito identity jsに変更しました。
Material UIの導入に伴い依存関係で問題が起きていますが、応急的に
強制インストールという形を取っています。

```
npm install --legacy-peer-deps 
```

src/conf/awsauth.js xxxxとなっているとこを修正

```js
const awsConfiguration = {
    region: 'ap-northeast-1',
    UserPoolId: 'ap-northeast-1_xxxxxx',
    ClientId: 'xxxxxxxxxxxxxxxxxxxxx'
};
  
export default awsConfiguration;
```

src/conf/apigateway.js xxxxをapiキーに変更

```js 
const apigatewayConf = {
    END_POINT_URL: 'https://6c1o3159qj.execute-api.ap-northeast-1.amazonaws.com',
    API_KEY: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'
};
 
export default apigatewayConf;
```

起動する

```
npm start
```

ユーザープールID,アプリクライアントIDあたりは動かす際に伝えます
# 参考にしてるサイト

1. https://mseeeen.msen.jp/react-auth-with-ready-made-cognito/
2. https://rinoguchi.net/2022/01/cognito-identity-provider-api-authentication.html

# やってないこと
- パスワードリセット機能

# 現状の問題
- validationをcognitoに任せてアラートでしか出せていない
- 確認コード再送画面でeメール以外の文字列を打ち込んでもコードを送信しようとする

# API Gateway Doc
エンドポイントはTeamsのapi-url.txtを参照

APIはAPI Gatewayの"dev"ステージにデプロイされてます。
CORS有効化済み。
## マッチング(GET)
m-result?wskill={教わりたいスキル,ゲーム}&hskill={教えたいスキル,ゲーム}

## コーチングリクエストの送信(POST)
coaching/send?reqUID={コーチングリクエスト対象者UID}&senderUID={送り主ID(自分のID)}

## リクエスト状態書き換え(POST)
coaching/chreq?crPK={リクエストモデルのid}&reqsts={リクエスト状態 accept or decline}

## リクエスト削除(DELETE)
coaching/destroyreq?crPK={リクエストモデルのid}

## リクエスト保留(POST)
coaching/pending?uid={保留対象者}&&puid={current user id(cognito)}
## リクエスト保留ユーザー一覧(GET)
coaching/getpending?userid={保留対象ユーザー}

## IDからUser情報取得(GET)
users?userid={ユーザーのid(マッチしたユーザーのidから取得しているもの)}

## 送られてきたリクエストの一覧を取得(GET)
coaching/notify?requid={current user id(cognito)}

## 自分が送ったリクエストの一覧を取得(GET)
coaching/myreq?suid={current user id(cognito)}

## ユーザー情報編集(POST)(別APIでつくってる為エンドポイント変わってます。)
deploy0_0/send

## cognitoユーザープールからユーザーを削除(GET)
user/destroy?userid={current user id}
## dynamoDB Userテーブルからユーザーを削除(GET)
user/destroydb?userid={current user id}

ユーザー情報編集、ユーザー削除はAPI名がことなる(エンドポイントが違う)

## チャットメッセージ送信(POST)
chat/create (bodyで値受け渡し)

body送信例
```js

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
```

## チャットメッセージ一覧取得(GET)
chat/getchats?roomid={チャットメッセージのid}

## 評価送信(POST)
feedback/post  (bodyで値受け渡し)
## 評価一覧取得(GET)
feedback/get?id={評価対象者id}
