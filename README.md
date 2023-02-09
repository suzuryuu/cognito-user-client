# 出来てること
## ユーザー関係
Cognito利用で
- 新規登録
- コード確認、再送
- ログイン(この時DynamoのUserテーブルにidとemailが保存される)
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

##　出来ていないこと
- コーチングした人同士だけで評価できるようにする(現状誰でも評価ができる。それでも問題ないけど、コーチングを行っていないのに虚偽評価を行うリスクを防げない)
- マッチングの履歴を取る
- 評価機能の☆の必須化、入力してないときのエラーハンドハンドリングが出来てない(F12コンソールでhttpリクエストのエラーは確認できる)


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
## マッチング(GET)
/dev/m-result?wskill={教わりたいスキル,ゲーム}&hskill={教えたいスキル,ゲーム}

## コーチングリクエストの送信(POST)
/dev/coaching/send?reqUID={コーチングリクエスト対象者UID}&senderUID={送り主ID(自分のID)}

## リクエスト状態書き換え(POST)
/dev/coaching/chreq?crPK={リクエストモデルのid}&reqsts={リクエスト状態 accept or decline}

## IDからUser情報取得(GET)
/dev/users?userid={ユーザーのid(マッチしたユーザーのidから取得しているもの)}

## 送られてきたリクエストの一覧を取得(GET)
/dev/coaching/notify?requid={current user id(cognito)}

## 自分が送ったリクエストの一覧を取得(GET)
/dev/coaching/myreq?suid={current user id(cognito)}

## ユーザー情報編集(POST)(別APIでつくってる為エンドポイント変わってます。)
/deploy0_0/send

## cognitoユーザープールからユーザーを削除
/dev/user/destroy?userid={current user id}
## dynamoDB Userテーブルからユーザーを削除
/dev/user/destroydb?userid={current user id}