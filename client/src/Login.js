import { useState, useEffect } from "react";
import { loginUser } from "./ServerConnection";
import { useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";
import Grid from '@mui/material/Grid';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

const Login = () => {

  const [username, setusername] = useState("");
  const [password, setPassword] = useState("");
  const [disabledFlag, setDisabledFlag] = useState(true);
  const cookies = new Cookies();

  const navigate = useNavigate();

  const handleusernameChange = (input) => {
    setusername(input.target.value);
  };

  const handlePasswordChange = (input) => {
    setPassword(input.target.value);
  };

  const handleLoginSubmit = (event) => {
    event.preventDefault();
        loginUser(username, password)
        .then((response)=>{
          if(response.status===200){
            cookies.set('token', response.data.token, {maxAge: 3600});
          }
          navigate("/home");
        })
  };

  useEffect(() => {
    setDisabledFlag(false);
    if (username === "" || password === "") {
      setDisabledFlag(true);
    }
  }, [username, password]);

  
  const theme=createTheme();
  theme.typography.h3={
    fontSize: '1.2rem',
    
  '@media (min-width:600px)': {
    fontSize: '1.5rem',
  },
  [theme.breakpoints.up('md')]: {
    fontSize: '2.4rem',
  },
};

  return (
    <>
    <ThemeProvider theme={theme}>
    
    <Grid  container
    spacing={0}
    align="center"
    justify="center"
    direction="column"
    justifyContent="center"
  style={{ minHeight: '100vh' }}
    >
             <div className="login-header">
            <ThemeProvider theme={theme}>
      <Typography component="h1" variant="h3" color="#0077b5"> Sign In</Typography>
       <Typography component="h1" variant="h4" color="#0077b5">  Enter your credentials.</Typography>
        </ThemeProvider>         
          </div>
          
          
            <form className="login-form">
              <div>
                
                <TextField
              margin="normal"
              variant="outlined"
               size="small"
              required
             type="text"
              id="username"
              label="username"
              name="username"
              autoComplete="username"
              onChange={handleusernameChange}
              
              autoFocus
            />           
                
                <br />
                <TextField
              margin="normal"
              required
              variant="outlined"
               size="small"
              name="password"
              label="Password"
              type="password"
              id="password"
              onChange={handlePasswordChange}
              autoComplete="current-password"
            />
                
               
                <br />
                <Button
             
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={disabledFlag}
              onClick={handleLoginSubmit}           >
                
                  Login
                  </Button>
              </div>
            </form>
            </Grid>
          </ThemeProvider>
          
    </>
  );
};

export { Login };