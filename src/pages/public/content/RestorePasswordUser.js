import { Link as RouterLink } from 'react-router-dom';
// material
import { styled } from '@mui/material/styles';
import { Card, Stack, Container, Typography } from '@mui/material';
// layouts
import AuthLayout from '../../../layouts/AuthLayout';
// components
import Page from '../../../components/Page';
import { MHidden } from '../../../components/@material-extend';
import { LoginForm } from '../../../components/authentication/login';
import { RestorePassForm } from '../../../components/authentication/restorepass';

// import AuthSocial from '../../../components/authentication/AuthSocial';

// ----------------------------------------------------------------------

const RootStyle = styled(Page)(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    display: 'flex',
    // backgroundColor: theme.palette.primary.main,
  }
}));

const SectionStyle = styled(Card)(({ theme }) => ({
   backgroundColor: "#fff",
  // backgroundColor: theme.palette.primary.main,
  width: 464,
  height: '95vh',
  maxWidth: 464,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  margin: theme.spacing(2, 0, 2, 2),
  border: "none",
  // boxShadow: "none"
}));

const SectionStyleInto = styled('div')(({ theme }) => ({
  backgroundColor: "#fff",
  // backgroundColor: theme.palette.primary.main,
  // width: 464,
  // height: '95vh',
  // maxWidth: 464,
  // display: 'flex',
  // flexDirection: 'column',
  // justifyContent: 'center',
  // margin: theme.spacing(2, 0, 2, 2)
}));

const ContentStyle = styled('div')(({ theme }) => ({
  maxWidth: 480,
  minWidth: 350,
  margin: 'auto',
  display: 'flex',
  minHeight: '100vh',
  flexDirection: 'column',
  justifyContent: 'center',
  padding: theme.spacing(12, 0)
}));

// ----------------------------------------------------------------------

export default function RestorePasswordUser() {
  return (
    <RootStyle title="Restaurar password | RepuestosGo">
      {/* 
      <AuthLayout>
        
          ¿Aun no posees una cuenta? &nbsp;
          <Link underline="none" variant="subtitle2" component={RouterLink} to="/register">
            Registrate
          </Link>
        
      </AuthLayout>
      */}

      <MHidden width="mdDown" minHeight="">
        <div>
          <SectionStyle>

            <SectionStyleInto sx={{ py: 2 }}>
              <div className="text-center">
                <img src="/assets/img/logo/LOGOb.png" className='mx-auto w-200' style={{maxWidth: "320px", minWidth: "320px"}} alt="login" />
              </div>
            </SectionStyleInto>

            <Typography variant="h5" sx={{ px: 5, textAlign: 'center' }}>
                Tu solución inteligente, segura, rápida y al mejor precio.
            </Typography>

            <SectionStyleInto sx={{ py: 2 }}>
              <div className="text-center">
                <img src="/assets/svgimg/art-home-1.jpg" className='mx-auto w-100' style={{maxWidth: "200px", minWidth: "150px"}} alt="login" />
              </div>
            </SectionStyleInto>
            
            {/* 
            <Typography color="primary.main" variant="h1" sx={{ px: 5, mt: 5, mb: 1, fontWeight: 900 }}>
              RepuestosGo
            </Typography>
            <Typography color="body1" variant="h5" sx={{ px: 5 }}>
                Recupera tus datos de inicio de sesión y comienza a hacer un plan de salud para ti y tu familia.
            </Typography>
            
            <SectionStyleInto sx={{ py: 2 }}>
              <div className="text-center">
                <img src="/static/password.png" className='mx-auto w-100' style={{maxWidth: "400px", minWidth: "400px"}} alt="login" />
              </div>
            </SectionStyleInto>
            */}

          </SectionStyle>
        </div>
      </MHidden>

      <Container className='' maxWidth="sm">
        <ContentStyle>
          <Stack sx={{ mb: 5 }}>
            <Typography variant="h3" gutterBottom>
              Restaurar password
            </Typography>
            <Typography sx={{ color: 'text.secondary' }}>Para cambiar y o recuperar su password complete los datos a continuación.</Typography>
          </Stack>
          <RestorePassForm />
        </ContentStyle>
      </Container>
    </RootStyle>
  );
}
