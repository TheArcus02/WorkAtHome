import { Avatar, Card, CardActionArea, CardContent, Skeleton, Typography } from "@mui/material"
import { Box } from "@mui/system";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGetDoc } from "../../hooks/useGetDoc";
import { firestoreUser } from "../../utils/interfaces";

type EmpCardProps = {
    empUid: string;
}
const EmployeeCard: React.FC<EmpCardProps> = ({ empUid }) => {

    const [emp, setEmp] = useState<firestoreUser | null>(null)
    const { getDocument, document } = useGetDoc()
    const navigate = useNavigate()

    useEffect(() => {
        getDocument('Users', empUid)
    }, [])

    useEffect(() => {
        if (document) {
            setEmp(document as firestoreUser)
        }
    }, [document])


    return (
        <Card sx={{ maxWidth: 345 }} elevation={3}>
            <CardActionArea onClick={() => navigate(`/profile/${empUid}`)}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', m: 2 }}>
                    {emp  ? (
                    <Avatar
                        alt={emp.name}
                        src={emp.photoUrl ? emp.photoUrl : ""} 
                        sx={{ width: 168, height: 168 }}
                    >
                        <Typography fontSize={40}>{!emp.photoUrl && emp.displayName?.slice(0, 2)}</Typography>
                    </Avatar>
                    ): (
                        <Skeleton variant="circular" sx={{width:168, height:168}} />
                    )}
                    
                    <CardContent sx={{ textAlign: 'center', width:'100%' }}>
                        {emp ? (
                            <>
                                <Typography variant="h6" component="h6" my={1}>{emp.name.length > 0 && emp.surname.length > 0 ? emp.name + " " + emp.surname : emp.displayName}</Typography>
                                <Typography variant="body1" sx={{ maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", display: "-webkit-box", WebkitLineClamp: 8, WebkitBoxOrient: "vertical" }}>
                                    {emp.description}
                                </Typography>
                            </>
                        ) : (
                            <Box sx={{display:'flex', flexDirection:'column', alignItems:'center', gap:1}}>
                                <Skeleton height={10} width="70%" />
                                <Skeleton height={15} width="100%" />
                                <Skeleton height={15} width="100%" />
                                <Skeleton height={15} width="100%" />
                            </Box>
                        )}
                    </CardContent>

                </Box>
            </CardActionArea>
        </Card>

    )
}

export default EmployeeCard