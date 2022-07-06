import { Box, Link as MuiLink } from "@mui/material"
import { socialsInfo, socialNames } from "../../utils/interfaces"
import { FacebookOutlined, Instagram, LanguageOutlined, Twitter, YouTube} from '@mui/icons-material';
import { primary, primaryDark, secondary, secondaryDark, secondaryLight } from "../../utils/colors";
interface SocialLinkProps{
    social: socialsInfo
}


const getSocialIcon = (name: socialNames) => {
    switch(name){
        case 'facebook': return (
            <FacebookOutlined />
        )
        case 'instagram': return(
            <Instagram />
        )
        case 'twitter': return(
            <Twitter />
        )
        case 'website': return(
            <LanguageOutlined />
        )
        case 'youtube': return(
            <YouTube />
        )
        default: return null
    }   
}

export const SocialLink:React.FC<SocialLinkProps> = ({social}) => {
  return (
    <Box sx={{display:'flex', gap:2, flexWrap:{xs:'wrap', md:'nowrap'}}} mb={1}>
        <Box sx={{display:'flex', alignItems:'center'}}>
            <MuiLink target='_blank' rel="noopener" href={social.link} color="secondary" underline="none" sx={{'&:hover':{color: secondaryDark}, transition:'cubic-bezier(0.4, 0, 0.2, 1) 0ms, color 250ms'}}>
                {getSocialIcon(social.name)}
            </MuiLink>
        </Box>
         
    </Box>
  )
}
