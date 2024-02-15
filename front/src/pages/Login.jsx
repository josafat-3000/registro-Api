import * as React from 'react';
import { useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
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
import axios from "axios";
import { z } from 'zod';
// import { useAuth } from "../context/auth.context.jsx";

const defaultTheme = createTheme();

// Esquema de validación con Zod
const signInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export default function SignIn() {
  const [showPassword, setShowPassword] = useState(false);
  const [passwordEntered, setPasswordEntered] = useState(false);
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
      // Validar los datos del formulario con Zod
      signInSchema.parse({ email, password });
      // Si la validación es exitosa, enviar la solicitud al backend
      const response = await axios.post('http://localhost:3000/api/auth/login', { email, password });
      console.log('Respuesta del backend:', response.data);
      // Aquí puedes manejar la respuesta del backend, por ejemplo, redirigir al usuario a otra página
    } catch (error) {
      console.error('Error al enviar solicitud al backend:', error);
      // Si hay errores de validación, mostrarlos
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
                Iniciar Sesión
              </Typography>
              <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
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
                  helperText={errors.email}
                  InputProps={{
                    startAdornment: <InputAdornment position="start"><Mail color="disabled" /></InputAdornment>,
                  }}
                />
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
                  helperText={errors.password}
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
                <Grid container alignItems="center">
                  <Grid item xs>
                    <FormControlLabel
                      control={<Checkbox value="remember" color="primary" />}
                      label="Recuérdame"
                    />
                  </Grid>
                  <Grid item xs textAlign="right">
                    <Link href="/forgot" variant="body2">
                      ¿Olvidaste tu contraseña?
                    </Link>
                  </Grid>
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                  >
                    Iniciar Sesión
                  </Button>
                  <Grid item xs={12} >
                    <Link href="/register" variant="body2">
                      {"¿No tienes una cuenta?, Regístrate"}
                    </Link>
                  </Grid>
                </Grid>
              </Box>
            </Box>
            <Typography variant="body2" color="text.secondary" align="center">
              {'Copyright © '}
              <Link color="inherit" href="http://localhost:5173/">
                SAINT
              </Link>{' '}
              {new Date().getFullYear()}
              {'.'}
            </Typography>
          </Container>
        </ThemeProvider>
      </Paper>
    </Grid>
  );
}
