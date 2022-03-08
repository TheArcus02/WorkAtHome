import './App.css'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { CssBaseline, Typography } from '@mui/material'

const Darktheme = createTheme({
  palette:{
    mode: 'dark',
  }
})

const App:React.FC = () => {


  return (
    <ThemeProvider theme={Darktheme}>
      <CssBaseline>
        <Typography>App</Typography>
      </CssBaseline>
    </ThemeProvider>
  )
}

export default App
