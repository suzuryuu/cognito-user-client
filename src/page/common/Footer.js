import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import {
  FacebookShareButton,
  LineShareButton,
  TwitterShareButton,
  FacebookIcon,
  LineIcon,
  TwitterIcon,
} from "react-share";

export default function Footer() {
  return (
    <Box>
      <AppBar position="fixed" color="primary" sx={{top: "auto", bottom:0}}>
        <Toolbar >
          {/*利用規約に行く？　画面作成未定？*/}
          <a href="#" target="_blank" style={{ color: "white" }}>
            <Typography variant="h10" component="div">
              利用規約
            </Typography>
          </a>

          <Typography
            variant="h10"
            component="div"
            textAlign={"center"}
            sx={{ flexGrow: 1 }}
          >
            ©2023-team22
          </Typography>

          <Typography>
            <FacebookShareButton
              url={["シェアしたいURL"]}
              quote={["シェア時に一緒に投稿したいテキスト"]}
            >
              <FacebookIcon round={true} />
            </FacebookShareButton>

            <LineShareButton
              url={["シェアしたいURL"]}
              quote={["シェア時に一緒に投稿したいテキスト"]}
            >
              <LineIcon round={true} />
            </LineShareButton>

            <TwitterShareButton
              url={["シェアしたいURL"]}
              quote={["シェア時に一緒に投稿したいテキスト"]}
            >
              <TwitterIcon round={true} />
            </TwitterShareButton>
          </Typography>
        </Toolbar>
      </AppBar>
    </Box>
  );
}