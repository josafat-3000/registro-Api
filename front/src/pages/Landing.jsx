import * as React from 'react';
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import landingImage from '../assets/otzun.png';
import { createTheme, ThemeProvider } from '@mui/material/styles';


const defaultTheme = createTheme();

const LandingPage = () => {
  return (
    <ThemeProvider theme={defaultTheme}>
      <Container style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Grid container spacing={3}>
          {/* Imagen a la izquierda */}
          <Grid item xs={12} sm={6}>
            <img src={landingImage} alt="Landing" style={{ width: '100%', height: 'auto' }} />
          </Grid>

          {/* Texto y botones a la derecha */}
          <Grid item xs={12} sm={6} style={{ textAlign: 'center' }}>
            <Typography variant="h4" component="h1" gutterBottom>
              Bienvenido a nuestra aplicación
            </Typography>
            <Typography variant="body1" gutterBottom>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam gravida neque sed libero
              consectetur, id consectetur metus eleifend.
            </Typography>
            <Button href="/login" variant="contained" color="primary" style={{ marginRight: '10px' }}>
              Iniciar Sesión
            </Button>
            <Button href="/register" variant="contained" color="secondary">
              Registrarse
            </Button>
          </Grid>
        </Grid>
      </Container>
    </ThemeProvider>
  );
};

export default LandingPage;
