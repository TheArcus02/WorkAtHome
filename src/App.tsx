import './App.css'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { CssBaseline } from '@mui/material'
import { Routes, Route } from "react-router-dom";

//Pages & Components
import { Home } from './pages/Home';
import { Signup } from './pages/Singup';
import { Navbar } from './components/Navbar'
import { Login } from './pages/Login';
import { AuthProvider } from './contexts/AuthContext';


const Darktheme = createTheme({
  palette:{
    mode: 'dark',
  }
})

const App:React.FC = () => {

  return (
    <AuthProvider>
      <ThemeProvider theme={Darktheme}>
        <CssBaseline>
          <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/login" element={<Login />} />
            </Routes>
        </CssBaseline>
      </ThemeProvider>
    </AuthProvider>
    
  )
}

export default App
