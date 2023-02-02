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
    <div className="FooterContent">
        <h2 style={{color: "white", paddingTop: 40}}>Copyright 2023 team22</h2>
        <a href="#" style={{ color: "white", fontSize: 20}}>
           利用規約
        </a>
    </div>
  );
}