import React, { useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Paper from "@mui/material/Paper";
import InputAdornment from '@mui/material/InputAdornment';
import Lock from '@mui/icons-material/Lock';
import Mail from '@mui/icons-material/Mail';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Visibility from '@mui/icons-material/Visibility';
import { IconButton } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import axios from 'axios';
import { z } from 'zod';

const defaultTheme = createTheme();

const signUpSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
});

export default function Registrarse() {
  const [showPassword, setShowPassword] = useState(false);
  const [passwordEntered, setPasswordEntered] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});

  const handleClickShowPassword = () => setShowPassword(!showPassword);

  const handleEmailChange = (event) => setEmail(event.target.value);

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
    if (event.target.value.length > 0) {
      setPasswordEntered(true);
    } else {
      setPasswordEntered(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      signUpSchema.parse({ firstName, lastName, email, password });
      const response = await axios.post('http://localhost:3000/register', { firstName, lastName, email, password });
      console.log('Respuesta del backend:', response.data);
    } catch (error) {
      console.error('Error al enviar solicitud al backend:', error);
      if (error instanceof z.ZodError) {
        setErrors(error.errors.reduce((acc, curr) => {
          if (curr.path) {
            acc[curr.path[0]] = curr.message;
          }
          return acc;
        }, {}));
      }
    }
  };

  const paperStyle = {
    padding: '20px',
    height: 'auto',
    width: '80%',
    margin: '20px auto',
    maxWidth: '500px',
  };

  return (
    <Grid>
      <Paper elevation={10} style={paperStyle}>
        <ThemeProvider theme={defaultTheme}>
          <Container component="main" maxWidth="xs">
            <CssBaseline />
            <Box
              sx={{
                marginTop: 2,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                <LockOutlinedIcon />
              </Avatar>
              <Typography component="h1" variant="h5">
                Registrarse
              </Typography>
              <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      autoComplete="given-name"
                      name="firstName"
                      required
                      fullWidth
                      id="firstName"
                      label="Nombre"
                      autoFocus
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      error={errors.firstName ? true : false}
                      helperText={errors.firstName ? errors.firstName : ''}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      required
                      fullWidth
                      id="lastName"
                      label="Apellido"
                      name="lastName"
                      autoComplete="family-name"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      error={errors.lastName ? true : false}
                      helperText={errors.lastName ? errors.lastName : ''}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      margin="normal"
                      required
                      fullWidth
                      id="email"
                      label="Correo electrónico"
                      name="email"
                      autoComplete="email"
                      autoFocus
                      value={email}
                      onChange={handleEmailChange}
                      error={errors.email ? true : false}
                      helperText={errors.email ? errors.email : ''}
                      InputProps={{
                        startAdornment: <InputAdornment position="start"><Mail color="disabled" /></InputAdornment>,
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      margin="normal"
                      required
                      fullWidth
                      name="password"
                      label="Contraseña"
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      autoComplete="current-password"
                      value={password}
                      onChange={handlePasswordChange}
                      error={errors.password ? true : false}
                      helperText={errors.password ? errors.password : ''}
                      InputProps={{
                        startAdornment: <InputAdornment position="start"><Lock color="disabled" /></InputAdornment>,
                        endAdornment: passwordEntered && (
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={handleClickShowPassword}
                              edge="end"
                            >
                              {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                </Grid>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                >
                  Registrarse
                </Button>
                <Grid container justifyContent="flex-end">
                  <Grid item>
                    <Link href="/login" variant="body2">
                      ¿Ya tienes una cuenta? Inicia sesión
                    </Link>
                  </Grid>
                </Grid>
              </Box>
            </Box>
          </Container>
        </ThemeProvider>
      </Paper>
    </Grid>
  );
}
