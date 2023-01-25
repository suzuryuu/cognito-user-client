import React from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import NotificationsIcon from "@mui/icons-material/Notifications";
import ForumIcon from "@mui/icons-material/Forum";
import IconButton from "@mui/material/IconButton";
import Grid from "@mui/material/Grid";

//newsカード
import valo from "../../style/valosen.jpg";
import apex from "../../style/apexsen.jpg";
import spla from "../../style/splasen.jpg";
import "../../style/Home.css";

/*タグの一覧*/

const tag = [
  { label: "Apex Legends" },
  { label: "VALORANT" },
  { label: "Splatoon" },
  { label: "Other" },
];

const tag2 = [
  { label: "Shoot" },
  { label: "Capacity" },
  { label: "Judge" },
  { label: "Other" },
];

export default function TestHome() {
  return (
    <box>
      {/*アイコン配置 リンク*/}
      <Grid
        container
        direction="row"
        justifyContent="space-evenly"
        alignItems="center"
      >
        <Grid item xs={4}>
          <Autocomplete
            disablePortal
            id="combo-box"
            options={tag}
            sx={{ width: 200, pt: 10, flex: 1, flexGrow: 1 }}
            renderInput={(params) => <TextField {...params} label="GameName" />}
          />
        </Grid>

        {/*paramsの値で*/}
        <Grid item xs={4}>
          <Autocomplete
            disablePortal
            id="combo-box"
            options={tag2}
            sx={{ width: 200, pt: 10, flex: 1, flexGrow: 1 }}
            renderInput={(params) => (
              <TextField {...params} label="Gameplay Skill" />
            )}
          />
        </Grid>

        <Grid item xs={5} sm={5} pt={5}>
          <a href="#" target={"_blank"}>
            <IconButton>
              <NotificationsIcon sx={{ fontSize: 100, flexGrow: 1 }} />
            </IconButton>
          </a>
        </Grid>

        <Grid item xs={5} sm={4} pt={3}>
          <a href="#" target={"_blank"}>
            <IconButton>
              <ForumIcon sx={{ fontSize: 100, flexGrow: 1 }} />
            </IconButton>
          </a>
        </Grid>
      </Grid>
      <br />
      <br />
      {/*ニュース的なもの**/}
      <text class="text">
        <>News</>
      </text>
      <hr />
      <br />
      <div class="hrtitle" />
      <text class="game">VALORANT</text>
      <p class="ichigyou">
        <img src={valo} width="500" />
        <a>
          <span>まさか!?ヨル使いのエキスパート現る!!!～逆張りに学べ～</span>
          <br />
          <br />
          <span>先週アクティブユーザー〇人</span>
        </a>
      </p>
      <hr />

      <text class="game">Apex Legends</text>
      <p class="ichigyou">
        <img src={apex} width="500" />
        <a>
          <span>プレデターに挑戦中の猛者現る!!!</span>
          <br />
          <br />
          <span>先週アクティブユーザー最多!!!</span>
        </a>
      </p>
      <hr />

      <text class="game">Splatoon</text>
      <p class="ichigyou">
        <img src={spla} width="500" />
         <a>
          <span>コーチングによりX帯到達者現る!!!</span>
          <br />
          <br />
          <span>先週アクティブユーザー〇人</span>
          </a>
      </p>
      <hr />
    </box>
  );
}