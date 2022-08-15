import { createTheme, ThemeProvider } from '@mui/material/styles'
import { CssBaseline } from '@mui/material'
import { Routes, Route } from "react-router-dom";

//Pages & Components
import { Home } from './pages/Home';
import { Signup } from './pages/Singup';
import { Navbar } from './components/Navbar'
import { Login } from './pages/Login';
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from 'react-toastify';
import { Profile } from './pages/Profile';
import { RequireAuth } from './components/RequireAuth';
import { YourCompanies } from './pages/YourCompanies';
import { CreateCompany } from './pages/CreateCompany';
import { CompanyDetails } from './components/company/CompanyDetails';
import { background, paper, primary, secondary } from './utils/colors';
import { AddOffer } from './pages/AddOffer';
import { OfferDetails } from './components/offer/Details/OfferDetails';
import { YourJobOffers } from './pages/YourJobOffers';
import { Entries } from './components/offer/Entries/Entries';
import { YourJobApplications } from './pages/YourJobApplications';
import { Employees } from './components/company/Employees/Employees';


const Darktheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: primary,
    },
    secondary: {
      main: secondary,
    },
    background: {
      default: background,
      paper: paper,
    },
  },
  typography: {
    fontFamily: 'Poppins',
  },
})

const App:React.FC = () => {

  return (
      <ThemeProvider theme={Darktheme}>
        <CssBaseline>
          <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/login" element={<Login />} />
              <Route element={<RequireAuth />}>
                <Route path="/your-companies" element={<YourCompanies />} />
                <Route path="/create-company" element={<CreateCompany />} />
                <Route path="/add-offer" element={<AddOffer />} />
                <Route path="/offer/:uid/entries" element={<Entries />} />
                <Route path="/your-job-offers" element={<YourJobOffers />} />
                <Route path="/your-job-applications" element={<YourJobApplications />} />
                <Route path="/company/:uid/employees" element={<Employees />} />
              </Route>
              <Route path="/company/:uid" element={<CompanyDetails />} />
              <Route path="/offer/:uid" element={<OfferDetails />} />
              <Route path="/profile/:uid" element={<Profile />} />
            </Routes>
            <ToastContainer 
            autoClose={2000} 
            theme="dark" 
            position="bottom-left"
            />
        </CssBaseline>
      </ThemeProvider>
    
  )
}

export default App

// TODO add firebase rules
// TODO add working project on netlify
// TODO create popup when new employee is aproved with salary
// TODO add mobile view to timline in profile 
// TODO offers with sorting filtering page
// TODO implement rich text editor
// ? change location/address fields to objects with lat an lon to interact with google maps api