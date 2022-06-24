import {Link} from "react-router-dom";
import Grid from '@mui/material/Grid';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import LoginIcon from '@mui/icons-material/Login';
import Button from '@mui/material/Button';
import { Box } from "@mui/material";
import HowToRegIcon from '@mui/icons-material/HowToReg';
export const Welcome = ()=>{
    return(
      <Box align="center"  backgroundColor="primary.main" style={{ display:'flex',justifyContent:'center', minHeight: '100vh'}}>
      <Grid  container
      spacing={4}
      align="center"
      justify="center"
      direction="column"
      justifyContent="center"
      backgroundColor="white"
      margin={5}
    style={{width:500, maxHeight: '100vh'}}
      >
        <div>
        <Stack direction="row" justifyContent="center" spacing={2}>
            <Link to={"/login"}>  
            <Button
            
          color="success"
           variant="contained"
           sx={{ mt: 3, mb: 2 }}
          
         >
             <LoginIcon />
               Login
               </Button>
            </Link>
            
            <Link to={"/register"}>
                
                <Button
              
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              
            >
                <HowToRegIcon />
                Register
                  </Button>
            </Link>
            </Stack>
        </div>
        </Grid>
        </Box>
    )
}
