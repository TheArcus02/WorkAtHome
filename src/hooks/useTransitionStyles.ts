
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
    }
}))