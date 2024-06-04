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

export default function VerifyEmail() {

  const [searchParams] = useSearchParams();
  const dispatch       = useDispatch();

  let resInQuery  = searchParams.get('success');
  if(resInQuery !== undefined){
    if(resInQuery === "false"){
      resInQuery = false;
    }else{
      resInQuery = true;
    }
  }

  let isLoged     = useSelector(state => state.session.auth);
  let isVerify    = (resInQuery || false);

  console.log("--");
  console.log(resInQuery);
  console.log(isVerify);

  const [sendedData, setsendedData] = useState(false);
  const {loginByToken} = useAuth();

  // console.log(isLoged);

  useEffect(() => {
    if(isVerify){
      if(!sendedData){
        setsendedData(true);
        // loginByToken();
      }
    }
  }, []);
  

  if(isVerify){
    return (
      <RootStyle title="Verificación de email | RepuestosGo">
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
                  ¡Su email ha sido verificado exitosamente!
                </Typography>
              </motion.div>
              <Typography sx={{ color: 'text.secondary' }}>
                Ahora puede iniciar sesión utilizando su correo y aprovechar al máximo las funciones de RepuestosGo.
              </Typography>

              <motion.div variants={varBounceIn}>
                <Box
                  component="img"
                  src="/static/email-check.svg"
                  sx={{ height: 300, mx: 'auto', my: 2 }}
                />
              </motion.div>

              <Button to="/" size="large" variant="contained" component={RouterLink}>
                Volver al inicio
              </Button>
            </Box>
          </MotionContainer>
        </Container>
      </RootStyle>
    );
  }
    
  return (
      <RootStyle title="Verificación de email | RepuestosGo">
        <Container>
          <MotionContainer initial="initial" open>
            <Box
              component="img"
              src="/static/logo.png"
              sx={{ mb: 3, maxWidth: 300 }}
            />
            <Box sx={{ maxWidth: 800, margin: 'auto', textAlign: 'center' }}>
              <motion.div variants={varBounceIn}>
                <Typography variant="h3" paragraph>
                  ¡Ha ocurrido un error verificando su email!
                </Typography>
              </motion.div>
              <Typography sx={{ color: 'text.secondary' }}>
                Para mas información pongase en contacto con nuestro equipo de soporte.
              </Typography>

              <motion.div variants={varBounceIn}>
                <Box
                  component="img"
                  src="/static/email-times.svg"
                  sx={{ height: 300, mx: 'auto', my: 2 }}
                />
              </motion.div>

              <Button to="/" size="large" variant="contained" component={RouterLink}>
                Volver al inicio
              </Button>
            </Box>
          </MotionContainer>
        </Container>
      </RootStyle>
    );
}
