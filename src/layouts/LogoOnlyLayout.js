import { Link as RouterLink, Outlet } from 'react-router-dom';
// material
import { Card, Stack, Container, Typography, Grid } from '@mui/material';
import { styled } from '@mui/material/styles';
// components
import Logo from '../components/Logo';

// ----------------------------------------------------------------------

const HeaderStyle = styled('header')(({ theme }) => ({
  top: 0,
  left: 0,
  lineHeight: 0,
  width: '100%',
  position: 'absolute',
  padding: theme.spacing(3, 3, 0),
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(5, 5, 0)
  }
}));

// ----------------------------------------------------------------------

export default function LogoOnlyLayout() {
  return (
    <>
      <HeaderStyle>
        <Grid container>
          <Grid item xs={6} md={4}>
            
              <RouterLink to="/">
                <img 
                  src="/assets/img/logo/LOGOb.png"  
                  width="400px" 
                  alt="logo" 
                />
              </RouterLink>
            
          </Grid>
        </Grid>
      </HeaderStyle>
      <Outlet />
    </>
  );
}
