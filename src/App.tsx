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


const Darktheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#8172de',
    },
    secondary: {
      main: '#ffae82',
    },
    background: {
      default: '#484656',
      paper: '#5a5867',
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
                <Route path="/profile" element={<Profile />} />
                <Route path="/your-companies" element={<YourCompanies />} />
                <Route path="/create-company" element={<CreateCompany />} />
                <Route path="/company/:uid" element={<CompanyDetails />} />
              </Route>
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