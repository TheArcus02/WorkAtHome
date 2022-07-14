import { Box, Card, CardContent, Divider, Skeleton } from "@mui/material";

type offerSkeletonProps = {
  elevation: number;
  width?: number | string; 
}

export const OfferSkeleton:React.FC<offerSkeletonProps> = ({ elevation, width }) => {
  return (
    <Card sx={!width ? { width: 385 } : {width: width} } elevation={elevation}>
            <CardContent>
              <Skeleton height={10} width="90%" />
              <Skeleton height={10} width="40%" sx={{mt:1.5}} />
              <Box sx={{display: 'flex', gap:1.5, my:1.5}}>
                <Skeleton variant="rectangular" height={25} width={100} />
                <Skeleton variant="rectangular" height={25} width={100} />
              </Box>
              <Divider />
              <Skeleton variant="rectangular" height={80} width="100%" sx={{my:2}} />
              <Divider />
              <Box sx={{display: 'flex', gap:1.5, mt:1.5}}>
                <Skeleton variant="circular" height={30} width={60} />
                <Skeleton variant="circular" height={30} width={60} />
                <Skeleton variant="circular" height={30} width={60} />
              </Box>
            </CardContent>
    </Card>
  )
}
