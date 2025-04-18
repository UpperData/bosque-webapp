import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
// material
import { styled } from '@mui/material/styles';
import { Box, Link, Button, Drawer, Typography, Avatar, Stack } from '@mui/material';

// components
import Logo from '../../components/Logo';
import Scrollbar from '../../components/Scrollbar';
import NavSection from '../../components/NavSection';
import { MHidden } from '../../components/@material-extend';
//
import sidebarConfig from './SidebarConfig';
import {useSelector} from "react-redux"

// ----------------------------------------------------------------------

const DRAWER_WIDTH = 280;

const RootStyle = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('lg')]: {
    flexShrink: 0,
    width: DRAWER_WIDTH
  }
}));

const AccountStyle = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(2, 2.5),
  borderRadius: theme.shape.borderRadiusSm,
  backgroundColor: theme.palette.grey[200]
}));

// ----------------------------------------------------------------------

DashboardSidebar.propTypes = {
  isOpenSidebar: PropTypes.bool,
  onCloseSidebar: PropTypes.func
};

export default function DashboardSidebar({ isOpenSidebar, onCloseSidebar }) {
  const { pathname }      = useLocation();

  const userData          = useSelector(state => state.session.userData.data);
  const menu              = useSelector(state => state.dashboard.menu);
  const role              = useSelector(state => state.dashboard.role);

  // console.log("menues =====");
  // console.log(menu);
  // console.log(sidebarConfig);

  let finalMenuConfig = sidebarConfig.concat(menu);
  // console.log(finalMenuConfig);

  useEffect(() => {
    if (isOpenSidebar) {
      onCloseSidebar();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);


  // console.log(userData);

  let photoURL = "";
  if(userData.people && (userData.people.photo !== null && userData.people.photo !== "")){
      photoURL = `data:image/png;base64, ${userData.people.photo}`;
  }else if(userData.people && (userData.people.document.gender === "H")){
      photoURL = "/assets/svgimg/user-circle.svg";
  }else if(userData.people && (userData.people.document.gender === "M")){
      photoURL = "/assets/svgimg/user-circle.svg";
  }else{
      photoURL = "/assets/svgimg/user-circle.svg";
  }

  const renderContent = (
    <Scrollbar
      sx={{
        height: '100%',
        '& .simplebar-content': { height: '100%', display: 'flex', flexDirection: 'column' }
      }}
    >
      <Box sx={{ px: 2.5, py: 3 }}>
        <Box component={RouterLink} to="/" sx={{ display: 'inline-flex' }}>
          <Logo />
        </Box>
      </Box>

      <Box sx={{ mb: 5, mx: 2.5 }}>
        <Link underline="none" component={RouterLink} to="#">
          <AccountStyle>
            <Avatar src={photoURL} alt="photoURL" />
            <Box sx={{ ml: 2 }}>

              <Typography variant="subtitle2" sx={{ color: 'text.primary' }}>
              {userData.people &&
                <Typography variant="subtitle2" sx={{ color: 'text.primary' }}>
                  {userData.people.firstName ? (userData.people.firstName+' '+userData.people.lastName) : userData.account.name}
                </Typography>
              }
              </Typography>
              
              <Typography variant="body2" sx={{ fontSize: 10, fontWeight: 800 }}>
                {role.name}
              </Typography>
              
            </Box>
          </AccountStyle>
        </Link>
      </Box>

      <NavSection navConfig={finalMenuConfig} />

      <Box sx={{ flexGrow: 1 }} />
      {/* 
      <Box sx={{ px: 2.5, pb: 3, mt: 10 }}>
        <Stack
          alignItems="center"
          spacing={3}
          sx={{
            p: 2.5,
            pt: 5,
            borderRadius: 2,
            position: 'relative',
            bgcolor: 'grey.200'
          }}
        >
          <Box
            component="img"
            src="/static/illustrations/illustration_avatar.png"
            sx={{ width: 100, position: 'absolute', top: -50 }}
          />

          <Box sx={{ textAlign: 'center' }}>
            <Typography gutterBottom variant="h6">
              Get more?
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              From only $69
            </Typography>
          </Box>

          <Button
            fullWidth
            href="https://material-ui.com/store/items/minimal-dashboard/"
            target="_blank"
            variant="contained"
          >
            Upgrade to Pro
          </Button>
        </Stack>
      </Box>
      */}
    </Scrollbar>
  );

  return (
    <RootStyle>
      <MHidden width="lgUp">
        <Drawer
          open={isOpenSidebar}
          onClose={onCloseSidebar}
          PaperProps={{
            sx: { width: DRAWER_WIDTH }
          }}
        >
          {renderContent}
        </Drawer>
      </MHidden>

      <MHidden width="lgDown">
        <Drawer
          open
          variant="persistent"
          PaperProps={{
            sx: {
              width: DRAWER_WIDTH,
              bgcolor: 'background.default'
            }
          }}
        >
          {renderContent}
        </Drawer>
      </MHidden>
    </RootStyle>
  );
}
