import './App.css'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { CssBaseline } from '@mui/material'
import { Navbar } from './components/Navbar'
import {
  Routes,
  Route,
} from "react-router-dom";
import { Home } from './pages/Home';

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
          </Routes>
      </CssBaseline>
    </ThemeProvider>
  )
}

export default App
