# 出来てること
## 認証
Cognito利用で
- 新規登録
- コード確認、再送
- ログイン
- ログアウト
## マッチング
- 条件に合致したユーザーを検索し表示
- リクエストの通知と来ているリクエストの一覧の表示

※AWS Lambdaの関数自体ではサービスを成立させるための機能は実装済みです。
# 起動
依存関係を入れる
※仕様SDKをAmplify sdkからcognito identity jsに変更しました。
Material UIの導入に伴い依存関係で問題が起きていますが、応急的に
強制インストールという形を取っています。

```
npm install --legacy-peer-deps 
```

src/conf/にawsauth.jsを追加し下記を記述
xxxxとなっているとこを修正

```js
const awsConfiguration = {
    region: 'ap-northeast-1',
    UserPoolId: 'ap-northeast-1_xxxxxx',
    ClientId: 'xxxxxxxxxxxxxxxxxxxxx'
};
  
export default awsConfiguration;
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
- コーチングリクエストを送る、ユーザー情報の編集などではAPI GatewayのPOSTを使おうと
しているが、Key-ValueでBodyを送っても500エラーが返ってくる