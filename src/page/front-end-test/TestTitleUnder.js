import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import '../../style/Title.css';

export default function Titleunder() {
  return (
    <body className="titlecontent">
    <Box>
      {/*カードサイズ sx={{ maxWidth: 300 }} */}
      <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}  class="body">
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
            <a href="logon.html">登録はこちらから</a>
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
              <a href="login.html">登録済みの方はこちらから</a>
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
          <a href="login.html">退会はこちらから</a>
          </Typography>
          <Typography color="text.secondary"align="center" style={{color: "white"}}>
            ＊退会するとアカウントが消えます。
            </Typography>
        </CardContent>
      </Card>
    </Box>
    </body>
  );
}