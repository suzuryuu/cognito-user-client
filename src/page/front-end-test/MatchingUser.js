import { Button } from "primereact/button";
import img from "./user.jpg";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import ReactStars from "react-rating-stars-component";
import '../../style/matching.css'
export default function Matchinguser() {

  /*星マークの受付*/
  const ratingChanged = (newRating) => {};

  return (
    <div className="matchedUserInfo">
    <Box>
      {/*全体位置指定*/}
      <Grid
        container
        direction="column"
        justifyContent="center"
        alignItems="center"
      >
        <Grid>
          {/*画像サイズ指定　初期画像は{img}user.jpg*/}
          <img
            src={img}
            style={{
              width: "200px",
              height: "200px",
              borderRadius: "50%",
              objectFit: "cover",
            }}
          />
        </Grid>

        {/*マッチングしたユーザ名*/}
        <Grid>名前</Grid>
        
        {/*星マーク指定　星の数 星のサイズ*/}
        <Grid>
          評価
          <ReactStars
            count={5}
            onChange={ratingChanged}
            size={24}
            activeColor="#ffd700"
          />
          <label>実績: 件</label>
        </Grid>

        <Grid>
          <p>自己紹介:</p>
        </Grid>

        <Grid item xs={5} sm={8} pt={5}>
          <Button
            style={{
              width: "300px",
              height: "50px",
            }}
            label="コーチングリクエストを送る"
          />
        </Grid>

        <Grid item xs={5} sm={8} pt={5}>
          <Button
            style={{
              width: "300px",
              height: "50px",
            }}
            label="保留する"
          />
        </Grid>
      </Grid>
    </Box>
    </div>
  );
}