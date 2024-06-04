import { Link as RouterLink } from 'react-router-dom';
// material
import { styled } from '@mui/material/styles';
import { Card, Stack, Container, Typography, Button } from '@mui/material';

// components
import Page from '../../components/Page';

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
  margin: 'auto',
  display: 'flex',
  minHeight: '100vh',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  padding: theme.spacing(12, 0)
}));

// ----------------------------------------------------------------------

export default function TokenExpired() {
  return (
    <RootStyle title="Sesión expirada | RepuestosGo">
      <Container className='' maxWidth="sm">
        <ContentStyle>

          {/* 
            <img src="/static/virus.png" style={{width: "100%", maxWidth: "400px"}} alt="logo" />
          */}
          <Stack>
            <Typography variant="h3" gutterBottom align='center'>
              Su sesión ha expirado
            </Typography>
            <Button component={RouterLink} color="primary" 
              // color="" 
              to="/"
            >
              Volver al inicio
            </Button>
          </Stack>

        </ContentStyle>
      </Container>
    </RootStyle>
  );
}
