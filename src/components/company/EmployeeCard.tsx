import { Avatar, Card, CardActionArea, CardContent, CardMedia, Typography } from "@mui/material"
import { Box } from "@mui/system";
import { useEffect, useState } from "react";
import { useGetDoc } from "../../hooks/useGetDoc";
import { firestoreUser } from "../../utils/interfaces";
import { Loader } from "../Loader";

type EmpCardProps = {
    empUid: string;
}
const EmployeeCard:React.FC<EmpCardProps> = ({empUid}) => {
    
    const [emp, setEmp] = useState<firestoreUser | null>(null)

    const { getDocument, document } = useGetDoc()

    useEffect(() => {
      getDocument('Users', empUid)
    }, [])
    
    useEffect(() => {
      if(document){
        setEmp(document as firestoreUser)
      }
    }, [document])
    

    return (
    emp ? (
        <Card sx={{ maxWidth: 345}} elevation={3}>
            <CardActionArea >
                <Box sx={{display:'flex', flexDirection:'column', alignItems:'center', m:2}}>
                    <Avatar
                        alt={emp.name}
                        src={emp.photoUrl ? emp.photoUrl : ""} sx={{ width: 168, height: 168}} 
                    >
                        <Typography fontSize={40}>{!emp.photoUrl && emp.displayName?.slice(0,2)}</Typography>
                    </Avatar>
                    <CardContent sx={{textAlign:'center'}}>
                        <Typography variant="h6" component="h6" my={1}>{emp.name.length > 0 && emp.surname.length > 0 ? emp.name + " " + emp.surname : emp.displayName}</Typography>
                        <Typography variant="body1" sx={{ maxWidth:200, overflow: "hidden", textOverflow:"ellipsis", display:"-webkit-box", WebkitLineClamp: 8, WebkitBoxOrient:"vertical"}}>
                            {emp.description}
                            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Vel eius deleniti eveniet rerum dolores nihil eum numquam maiores impedit accusamus, a, in tempore error ab est, debitis magnam asperiores! Quas.
                            Nihil accusantium, voluptas architecto commodi ex hic quod dignissimos? Qui non recusandae fuga architecto autem ullam eligendi, eaque ipsa possimus similique praesentium harum, expedita totam debitis at hic quia alias?    
                        </Typography>
                        {
                            // TODO delete lorem
                        }
                    </CardContent>
                    
                </Box>
            </CardActionArea>
        </Card>
    ) : (

        // TODO replace with skelton of card
        <Loader />
    )
  )
}

export default EmployeeCard