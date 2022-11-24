# 出来てること
Cognito利用で
- 新規登録
- コード確認、再送
- ログイン
- ログアウト
# 起動
依存関係を入れる
※仕様SDKをAmplify sdkからcognito identify jsに変更しました。
```
npm install
```

src/conf/awsauth.jsのxxxxとなっているとこを修正

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
