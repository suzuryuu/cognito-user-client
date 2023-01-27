//統合してみました
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import '../style/Title.css';
//利用手順
import SearchIcon from "@mui/icons-material/Search";
import ChatIcon from "@mui/icons-material/Chat";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import SecurityUpdateGoodIcon from "@mui/icons-material/SecurityUpdateGood";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import GroupRemoveIcon from "@mui/icons-material/GroupRemove";
import StarIcon from "@mui/icons-material/Star";

{/*Game Skill TeO */}
export default function title() {
  return (
    <body className="ttlbdycontent">
    <Box class="body2">
      {/*タイトルの位置*/}
      <Box sx={{ flexGrow: 1 }} >
        <Grid container spacing={0} >
          <Grid item xs={12} align="center">
            <Typography variant="h2"  class="text1">Mu-Tech
            <><div class="text3">[ミューテック]</div></>
            </Typography>
            
          </Grid>
          <Grid item xs={12} align="center">
          <Typography variant="h1"class="text1" >ゲームスキルに磨きを</Typography>
          </Grid>
          <Grid item xs={12} align="center">
            {/** ここクリックしたら利用手順図にスムーススクロールするようにしたい */}
          <Typography variant="h2" class="text2" style={{marginTop: 10}}>↓利用手順↓</Typography>
          </Grid>
        </Grid>
      </Box>
      <div>
      <Grid
        container
        direction="row"
        justifyContent="center"
        alignItems="center"
      >
         <Grid item xs={3} sm={3}>
          <div class="bubble051">
            <br />
            <div class="basyo">①自分でユーザーを探す場合</div>
            <br/>
          </div>
        </Grid>
        <Grid item xs={3}>
          <div class="bubble051">
            <br />
            <div class="basyo">②相手からリクエストが届く場合</div>
            <br/>
          </div>
        </Grid>
      </Grid>
      {/*ここまでOK*/}
      <br />
      <Grid
        container
        direction="row"
        justifyContent="center"
        alignItems="center"
      >
       
        <Grid item xs={3} sm={3}>
          <div class="bubble05">
            <SearchIcon sx={{ fontSize: 80 }} />
            <br />
            <div>ホームから条件に合うユーザーを検索</div>
          </div>
        </Grid>
        <Grid item xs={3}>
          <div class="bubble05">
            <SecurityUpdateGoodIcon sx={{ fontSize: 80 }} />
            <br />
            <div>コーチングリクエスト受信</div>
          </div>
        </Grid>
      </Grid>

      <br />

      <Grid
        container
        direction="row"
        justifyContent="center"
        alignItems="center"
      >
        <Grid item xs={3} sm={3}>
          <div class="bubble05">
            <ThumbUpAltIcon sx={{ fontSize: 80 }} />
            <br />
            <div>検索したユーザーにリクエストを送信。</div>
            <div>相手の反応を待ちましょう。</div>
          </div>
        </Grid>
        <Grid item xs={3}>
          <div class="bubble05">
            <GroupAddIcon sx={{ fontSize: 80 }} />
            <GroupRemoveIcon sx={{ fontSize: 80 }} />
            <br />
            <div>承認するとマッチングが成立します。</div>
            <div>拒否するとリクエストが消失します。</div>
          </div>
        </Grid>
      </Grid>

      <br />

      <Grid
        container
        direction="row"
        justifyContent="center"
        alignItems="center"
      >
        <Grid item xs={3} sm={3}>
          <div class="bubble05">
            <ChatIcon sx={{ fontSize: 80 }} />
            <br />
            <div>マッチングが成立したら</div>
            <div>DMで会話をしましょう</div>
          </div>
        </Grid>
        <Grid item xs={3}>
          <div class="bubble05">
            <ChatIcon sx={{ fontSize: 80 }} />
            <br />
            <div>マッチングが成立したら</div>
            <div>DMで会話をしましょう</div>
          </div>
        </Grid>
      </Grid>

      <br />

      <Grid
        container
        direction="row"
        justifyContent="center"
        alignItems="center"
      >
        <Grid item xs={3} sm={3}>
          <div class="bubble05">
            <StarIcon sx={{ fontSize: 20 }} />
            <StarIcon sx={{ fontSize: 20 }} />
            <StarIcon sx={{ fontSize: 20 }} />
            <StarIcon sx={{ fontSize: 20 }} />
            <StarIcon sx={{ fontSize: 20 }} />
            <br />
            <div>コーチング終了後お互いに評価</div>
          </div>
        </Grid>
        <Grid item xs={3}>
          <div class="bubble05">
            <StarIcon sx={{ fontSize: 20 }} />
            <StarIcon sx={{ fontSize: 20 }} />
            <StarIcon sx={{ fontSize: 20 }} />
            <StarIcon sx={{ fontSize: 20 }} />
            <StarIcon sx={{ fontSize: 20 }} />
            <br />
            <div>コーチング終了後お互いに評価</div>
          </div>
        </Grid>
      </Grid>
    </div>
    <br/>
    <br/>
      <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}  class="body2">
        <CardContent>
          {/*カードのヘッダー*/}
          <CardHeader
            title="新規登録"
            titleTypographyProps={{variant:'h3' }}
            align="center"
            style={{ backgroundColor: "gray", color: "white"}}
            class="text1"
          />
          <Typography gutterBottom variant="h5" component="div" align="center">
            <a href="/signup">登録はこちらから</a>
          </Typography>

          <Typography color="text.secondary"align="center" style={{color: "white"}}>
            ＊メールアドレスが必要になります。
          </Typography>
        </CardContent>

        <Grid spacing={2}>
          <CardContent>
            <CardHeader
              title="ログイン"
              titleTypographyProps={{variant:'h3' }}
              align="center"
              style={{ backgroundColor: "gray", color: "white"  }}
              class="text1"
            />
            <Typography
              gutterBottom
              variant="h5"
              component="div"
              align="center"
            >
              <a href="/signin">登録済みの方はこちらから</a>
            </Typography>
            <Typography color="text.secondary"align="center" style={{color: "white"}}>
            ＊メールアドレス、パスワードが必要になります。
            </Typography>
          </CardContent>
        </Grid>

        <CardContent>
          <CardHeader
            title="退会"
            titleTypographyProps={{variant:'h3' }}
            align="center"
            style={{ backgroundColor: "gray" , color: "white" }}
            class="text1"
          />
          <Typography gutterBottom variant="h5" component="div" align="center">
          <a href="/signin">退会はこちらから</a>
          </Typography>
          <Typography color="text.secondary"align="center" style={{color: "white"}}>
            ＊退会するとアカウントが消えます。ログイン後、ユーザー情報編集ページから退会ページにアクセスしてください。
            </Typography>
        </CardContent>
      </Card>
    </Box>
    </body>
  );
}

