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


const Darktheme = createTheme({
  palette:{
    mode: 'dark',
  }
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

// TODO
// * Protected Routes
// * After login redirect