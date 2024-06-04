import { motion } from 'framer-motion';
import { Link as RouterLink } from 'react-router-dom';
// material
import { styled } from '@mui/material/styles';
import { Box, Button, Typography, Container } from '@mui/material';
// components
import { MotionContainer, varBounceIn } from '../../components/animate';
import Page from '../../components/Page';

// ----------------------------------------------------------------------

const RootStyle = styled(Page)(({ theme }) => ({
  display: 'flex',
  minHeight: '100%',
  alignItems: 'center',
  // paddingTop: theme.spacing(15),
  // paddingBottom: theme.spacing(10)
}));

// ----------------------------------------------------------------------

export default function Page404() {
  return (
    // <RootStyle title="404 Page Not Found | Bosque Marino">
       <Page title="Inventario | Bosque Marino">
      <Container maxWidth="xl">
        <MotionContainer initial="initial" open>
          <Box sx={{ maxWidth: 580, margin: 'auto', textAlign: 'center' }}>
            <motion.div variants={varBounceIn}>
              <Typography variant="h3" paragraph>
                La página que buscas no ha sido encontrada
              </Typography>
            </motion.div>
            <Typography sx={{ color: 'text.secondary' }}>
              Verifique la url e intente de nuevo, si cree que se puede tratar de un error contacte con nuestro equipo de soporte.
            </Typography>

            <motion.div variants={varBounceIn}>
              <Box
                component="img"
                src="/static/illustrations/illustration_404.svg"
                sx={{ height: 260, mx: 'auto', my: 3 }}
              />
            </motion.div>

            <Button to="/" size="large" variant="contained" component={RouterLink}>
              Volver al inicio
            </Button>
          </Box>
        </MotionContainer>
      </Container>
    </Page>
    // </RootStyle>
  );
}
