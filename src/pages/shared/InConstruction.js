import { motion } from 'framer-motion';
import { Link as RouterLink } from 'react-router-dom';
// material
import { styled } from '@mui/material/styles';
import { Box, Card, Button, Typography, Container } from '@mui/material';
// components
import { MotionContainer, varBounceIn } from '../../components/animate';
import Page from '../../components/Page';

import DashboardLayout from '../../layouts/dashboard';
// ----------------------------------------------------------------------

const RootStyle = styled(Page)(({ theme }) => ({
  // display: 'flex',
  // minHeight: '100%',
  // alignItems: 'center',
  // paddingTop: theme.spacing(15),
  paddingBottom: theme.spacing(10)
}));

// ----------------------------------------------------------------------

export default function InConstruction() {
  return (
    <RootStyle title="RepuestosGo">
        <Container>
            <Card sx={{ margin: 'auto', textAlign: 'center', py: 5 }}>
                <motion.div variants={varBounceIn}>
                <Typography variant="h3" paragraph>
                    Segmento en construcción .. 
                </Typography>
                </motion.div>
                <Typography sx={{ color: 'text.secondary' }}>
                    La página que ha solicitado aún no se encuentra disponible
                </Typography>

                <Box sx={{ my: 3 }}>
                    <Button to="/" size="large" variant="contained" component={RouterLink}>
                        Volver al inicio
                    </Button>
                </Box>
            </Card>
        </Container>
    </RootStyle>
  );
}
