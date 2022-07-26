import { ClassNameMap, Link as MuiLink } from "@mui/material"
import { socialsInfo, socialNames } from "../../utils/interfaces"
import { FacebookOutlined, Instagram, LanguageOutlined, Twitter, YouTube} from '@mui/icons-material';
import { useTransitionStyles } from "../../hooks/useTransitionStyles";

type fontSize = "small" | "inherit" | "large" | "medium" | undefined
interface SocialLinkProps{
    social: socialsInfo
    size: fontSize
}

const getClasses = (name: socialNames, styles:ClassNameMap<"youtube" | "secondaryToDark" | "primaryLight" | "infoToDark" | "twitter" | "instagram" | "facebook">) => {
    switch(name){
        case 'facebook': return styles.facebook
        case 'instagram': return styles.instagram
        case 'twitter': return styles.twitter
        case 'website': return styles.secondaryToDark
        case 'youtube': return styles.youtube
        default: return undefined
    }  
}

const getSocialIcon = (name: socialNames, size: fontSize) => {
    switch(name){
        case 'facebook': return (
            <FacebookOutlined fontSize={size} />
        )
        case 'instagram': return(
            <Instagram fontSize={size} />
        )
        case 'twitter': return(
            <Twitter fontSize={size} />
        )
        case 'youtube': return(
            <YouTube fontSize={size} />
        )
        case 'website': return(
            <LanguageOutlined fontSize={size} />
        )
        default: return null
    }   
}

export const SocialLink:React.FC<SocialLinkProps> = ({social, size}) => {

    const transitionStyles = useTransitionStyles()

    return (
        <MuiLink 
            target='_blank' 
            rel="noopener" 
            href={social.link} 
            className={getClasses(social.name, transitionStyles)}
        >
            {getSocialIcon(social.name, size)}
        </MuiLink>
    )
}
