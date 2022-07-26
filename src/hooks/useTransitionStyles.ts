
import { makeStyles } from "@mui/styles";
import { info, infoDark, primary, primaryDark, primaryLight, secondary, secondaryDark } from "../utils/colors";

export const useTransitionStyles = makeStyles((theme?: any) => ({
    secondaryToDark:{
        color: secondary,
        '&:hover':{color: secondaryDark},
        transition:'cubic-bezier(0.4, 0, 0.2, 1) 0ms, color 250ms'
    },
    primaryLight:{
        color: primaryLight,
        '&:hover':{color: primary},
        transition:'cubic-bezier(0.4, 0, 0.2, 1) 0ms, color 250ms'
    },
    infoToDark:{
        color: info,
        '&:hover':{color: infoDark},
        transition:'cubic-bezier(0.4, 0, 0.2, 1) 0ms, color 250ms'
    },
    youtube:{
        color: "#FF0000",
        '&:hover':{color: '#b20000'},
        transition:'cubic-bezier(0.4, 0, 0.2, 1) 0ms, color 250ms'
    },
    twitter:{
        color: "#1DA1F2",
        '&:hover':{color: '#1470a9'},
        transition:'cubic-bezier(0.4, 0, 0.2, 1) 0ms, color 250ms'
    },
    instagram:{
        color: '#E1306C',
        '&:hover':{color: '#9d214b'},
        transition:'cubic-bezier(0.4, 0, 0.2, 1) 0ms, color 250ms'
    },
    facebook:{
        color: '#00B2FF',
        '&:hover':{color: '#006AFF'},
        transition:'cubic-bezier(0.4, 0, 0.2, 1) 0ms, color 250ms'
    }
}))