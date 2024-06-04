import React, {useState , useEffect} from "react";
import { motion } from 'framer-motion';
import { Link as RouterLink, useSearchParams } from 'react-router-dom';
// material
import { styled } from '@mui/material/styles';
import { Box, Button, Typography, Container } from '@mui/material';
// components
import { MotionContainer, varBounceIn } from '../../components/animate';
import Page from '../../components/Page';
import { useSelector, useDispatch } from 'react-redux';
import { useAuth } from "../../auth/AuthProvider";

// ----------------------------------------------------------------------

const RootStyle = styled(Page)(({ theme }) => ({
  display: 'flex',
  minHeight: '100%',
  alignItems: 'center',
  // paddingTop: theme.spacing(15),
  // paddingBottom: theme.spacing(10)
}));

// ----------------------------------------------------------------------

export default function RestorePassSuccess() {

    return (
      <RootStyle title="Restauración de password | RepuestosGo">
        <Container>
          <MotionContainer initial="initial" open>
            <Box
              component="img"
              src="/static/logo.png"
              sx={{ mb: 3, maxWidth: 300 }}
            />
            <Box sx={{ maxWidth: 800, margin: 'auto', textAlign: 'center' }}>
              <motion.div variants={varBounceIn}>
                <Typography variant="h3">
                  ¡Su password ha sido modificada exitosamente!
                </Typography>
              </motion.div>
              <Typography sx={{ color: 'text.secondary' }}>
                Ahora puede iniciar sesión utilizando su nuevo password.
              </Typography>

              <motion.div variants={varBounceIn}>
                <Box
                  component="img"
                  src="/static/passsuccess.png"
                  sx={{ height: 300, mx: 'auto', mb: 4 }}
                />
              </motion.div>

              <Button to="/login" size="large" variant="outlined" component={RouterLink}>
                Iniciar sesión
              </Button>
            </Box>
          </MotionContainer>
        </Container>
      </RootStyle>
    );
}
