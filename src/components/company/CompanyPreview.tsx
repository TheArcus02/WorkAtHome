import { PeopleAltOutlined, LocationOnOutlined, LanguageOutlined, DescriptionOutlined } from "@mui/icons-material"
import { Box, Typography, Paper, Divider, Container, Link as MuiLink } from "@mui/material"
import { primaryLight } from "../../utils/colors"
import { firestoreCompany, firestoreJobOffer } from "../../utils/interfaces"
import { OfferCard } from "../offer/OfferCard"
import EmployeeCard from "./EmployeeCard"

type CompanyPreviewProps = {
  companyInfo: firestoreCompany;
  offers: firestoreJobOffer[];
}
export const CompanyPreview: React.FC<CompanyPreviewProps> = ({ companyInfo, offers }) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', textAlign: 'justify' }} mx={5}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexDirection: { xs: 'column-reverse', md: "row" } }}>
        <Box>
          <Typography component="h2" variant="h4" mt={2} mb={2} fontWeight="bold" sx={{ textAlign: { xs: 'center', md: 'left' } }}>
            {companyInfo.name}
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: { xs: 'wrap', md: 'nowrap' } }} mb={2}>
            <Paper sx={{ p: 1.5 }} elevation={0}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <PeopleAltOutlined sx={{ color: primaryLight }} />
                <Typography ml={1}>{companyInfo.size}</Typography>
              </Box>
            </Paper>
            <Paper sx={{ p: 1.5 }} elevation={0}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <LocationOnOutlined sx={{ color: primaryLight }} />
                <Typography ml={1}>{companyInfo.address}</Typography>
              </Box>
            </Paper>

            {companyInfo.websiteUrl.length > 0 &&
              <Paper sx={{ p: 1.5 }} elevation={0}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <LanguageOutlined sx={{ color: primaryLight }} />
                  <MuiLink target='_blank' rel="noopener" href={companyInfo.websiteUrl} underline="none" color="secondary">
                    <Typography ml={1}>{companyInfo.name}</Typography>
                  </MuiLink>
                </Box>
              </Paper>

            }
          </Box>
        </Box>
      </Box>

      <Paper elevation={0} sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
          <DescriptionOutlined />
          <Typography variant="h5" ml={1}>Description</Typography>
        </Box>
        <Divider />
        <Typography variant="body1" mt={1.5}>
          {companyInfo.description}
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Officia deserunt, assumenda deleniti earum dignissimos unde? Alias ex quo ipsum modi, adipisci atque quisquam fugiat quaerat numquam beatae, veniam natus corrupti!
          Possimus accusantium sequi vitae voluptate corporis. Et praesentium quidem earum recusandae optio repellat cum nesciunt blanditiis cupiditate saepe necessitatibus, repellendus fuga reiciendis laborum assumenda laboriosam provident veritatis officia explicabo ut.
          Hic iure cumque blanditiis sed, saepe illum ex. Eos obcaecati deserunt qui adipisci minus laudantium excepturi possimus, incidunt molestiae illum veniam, temporibus hic est laborum consequatur. Cum dolore earum iusto!
        </Typography>
      </Paper>
      {companyInfo.employees.length > 0 &&
        <Box mt={5}>
          <Typography variant="h4" align="center">
            Our team
          </Typography>
          <Container
            maxWidth="lg"
            sx={{ mt: 5, display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}
          >
            {companyInfo.employees.slice(0,5).map((emp) => (
              <EmployeeCard empUid={emp} key={emp} />
            ))}
          </Container>

        </Box>
      }
      {offers.length > 0 &&
        <Box mt={5}>
          <Typography variant="h4" align="center">
            Job Offers
          </Typography>
          <Container sx={{ mt: 5, display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
            {offers.map((offer) => (
              <OfferCard offer={offer} elevation={3} key={offer.uid} />
            ))}
          </Container>
        </Box>
      }

    </Box>
  )
}
