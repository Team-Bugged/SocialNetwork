import {Link} from "react-router-dom";
import Grid from '@mui/material/Grid';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Stack from '@mui/material/Stack';

import Button from '@mui/material/Button';


export const Welcome = ()=>{
    return(
      <Grid  container
      spacing={4}
      align="center"
      justify="center"
      direction="column"
      justifyContent="center"
    style={{ minHeight: '100vh' }}
      >
        <div>
        <Stack direction="row" justifyContent="center" spacing={2}>
            <Link to={"/login"}>  
            <Button
            
          color="success"
           variant="contained"
           sx={{ mt: 3, mb: 2 }}
          
         >
             
               Login
               </Button>
            </Link>
            
            <Link to={"/register"}>
                
                <Button
           
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              
            >
                
                Register
                  </Button>
            </Link>
            </Stack>
        </div>
        </Grid>
    )
}
