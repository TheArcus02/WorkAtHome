import { Box, Link as MuiLink } from "@mui/material"
import { socialsInfo, socialNames } from "../../utils/interfaces"
import { FacebookOutlined, Instagram, LanguageOutlined, Twitter, YouTube} from '@mui/icons-material';
import { useTransitionStyles } from "../../hooks/useTransitionStyles";
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

    const transitionStyles = useTransitionStyles()

    return (
        <MuiLink 
            target='_blank' 
            rel="noopener" 
            href={social.link} 
            className={transitionStyles.secondaryToDark}
        >
            {getSocialIcon(social.name)}
        </MuiLink>
    )
}
