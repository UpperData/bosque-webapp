import { useState } from 'react';
import PropTypes from 'prop-types';
import { NavLink as RouterLink, matchPath, useLocation } from 'react-router-dom';
import arrowIosForwardFill from '@iconify/icons-eva/arrow-ios-forward-fill';
import arrowIosDownwardFill from '@iconify/icons-eva/arrow-ios-downward-fill';
// material
import { alpha, useTheme, styled } from '@mui/material/styles';
import { Box, List, Collapse, ListItemText, ListItemIcon, ListItemButton } from '@mui/material';
// ----------------------------------------------------------------------

import Icon from '@mdi/react';
// import IconsList from '@mdi/js';

const ListItemStyle = styled((props) => <ListItemButton disableGutters {...props} />)(
  ({ theme }) => ({
    ...theme.typography.body2,
    height: 48,
    position: 'relative',
    textTransform: 'capitalize',
    paddingLeft: theme.spacing(5),
    paddingRight: theme.spacing(2.5),
    color: theme.palette.text.secondary,
    '&:before': {
      top: 0,
      right: 0,
      width: 3,
      bottom: 0,
      content: "''",
      display: 'none',
      position: 'absolute',
      borderTopLeftRadius: 4,
      borderBottomLeftRadius: 4,
      backgroundColor: theme.palette.primary.main
    }
  })
);

const ListItemIconStyle = styled(ListItemIcon)({
  width: 22,
  height: 22,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
});

// ----------------------------------------------------------------------

NavItem.propTypes = {
  item: PropTypes.object,
  active: PropTypes.func
};

function NavItem({ item, active }) {

  const theme = useTheme();
  const isActiveRoot = active(item.path);
  const { title, path, icon, info, children, module, sModule, name} = item;
  const [open, setOpen] = useState(isActiveRoot);

  const handleOpen = () => {
    setOpen((prev) => !prev);
  };

  const activeRootStyle = {
    color: 'primary.main',
    fontWeight: 'fontWeightMedium',
    bgcolor: alpha(theme.palette.primary.main, theme.palette.action.selectedOpacity),
    '&:before': { display: 'block' }
  };

  const activeSubStyle = {
    color: 'text.primary',
    fontWeight: 'fontWeightMedium'
  };

  if (children || sModule) {

    let subitems = sModule || children;

    let isActiveRootInSub      = false;
    let isActiveRootInSubCount = 0;

    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < subitems.length; i++) {
      const subi = subitems[i];
      // console.log('/dashboard'+subi.route);
      const isActiveSub = active('/dashboard'+subi.route);
      if(isActiveSub){
        isActiveRootInSubCount += 1;
      }
    }

    if(isActiveRootInSubCount > 0){
      isActiveRootInSub = true;
    }

    let iconPath = icon ? require('@mdi/js')[icon.trim()] : ''; // eslint-disable-line global-require


    return (
      <>
        <ListItemStyle
          onClick={handleOpen}
          sx={{
            ...(isActiveRootInSub && activeRootStyle)
          }}
        >
          <ListItemIconStyle>
            
            {icon && typeof icon !== "string" && icon}
            {icon && typeof icon === "string" && 
              <Box 
                sx={{fontSize: 20}}
              >
                <Icon path={iconPath} size={1} />
              </Box>
            }
          
          </ListItemIconStyle>
          <ListItemText disableTypography primary={module} />
          {info && info}
          <Box
            component={Icon}
            icon={open ? arrowIosDownwardFill : arrowIosForwardFill}
            sx={{ width: 16, height: 16, ml: 1 }}
          />
        </ListItemStyle>

        <Collapse in={open} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {subitems.map((item) => {

              const { title, path, route, name } = item;
              let routeLink = '/dashboard'+route;
              const isActiveSub = active(routeLink);

              // console.log(route);
              // console.log(isActiveSub);

              return (
                <ListItemStyle
                  key={name}
                  component={RouterLink}
                  to={routeLink}
                  sx={{
                    ...(isActiveSub && activeSubStyle)
                  }}
                >
                  <ListItemIconStyle>
                    <Box
                      component="span"
                      sx={{
                        width: 4,
                        height: 4,
                        display: 'flex',
                        borderRadius: '50%',
                        alignItems: 'center',
                        justifyContent: 'center',
                        bgcolor: 'text.disabled',
                        transition: (theme) => theme.transitions.create('transform'),
                        ...(isActiveSub && {
                          transform: 'scale(2)',
                          bgcolor: 'primary.main'
                        })
                      }}
                    />
                  </ListItemIconStyle>
                  <ListItemText disableTypography primary={name} />
                </ListItemStyle>
              );
            })}
          </List>
        </Collapse>
      </>
    );
  }

  let iconPath = icon ? require('@mdi/js')[icon.trim()] : ''; // eslint-disable-line global-require

  return (
    <ListItemStyle
      component={RouterLink}
      to={path}
      sx={{
        ...(isActiveRoot && activeRootStyle)
      }}
    >
      {icon &&
        <ListItemIconStyle>
          <Icon path={iconPath} size={1} />
        </ListItemIconStyle>
      }
      {/*
        <ListItemIconStyle>{icon && icon}</ListItemIconStyle>
      */}
      <ListItemText disableTypography primary={title} />
      {info && info}
    </ListItemStyle>
  );
}

NavSection.propTypes = {
  navConfig: PropTypes.array
};

function slugify(str){
    str = str.replace(/^\s+|\s+$/g, '');

    // Make the string lowercase
    str = str.toLowerCase();

    // Remove accents, swap ñ for n, etc
    let from = "ÁÄÂÀÃÅČÇĆĎÉĚËÈÊẼĔȆÍÌÎÏŇÑÓÖÒÔÕØŘŔŠŤÚŮÜÙÛÝŸŽáäâàãåčçćďéěëèêẽĕȇíìîïňñóöòôõøðřŕšťúůüùûýÿžþÞĐđßÆa·/_,:;";
    let to   = "AAAAAACCCDEEEEEEEEIIIINNOOOOOORRSTUUUUUYYZaaaaaacccdeeeeeeeeiiiinnooooooorrstuuuuuyyzbBDdBAa------";
    
    // eslint-disable-next-line no-plusplus
    for (let i=0, l=from.length ; i < l ; i++) {
        str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
    }

    // Remove invalid chars
    str = str.replace(/[^a-z0-9 -]/g, '') 
    // Collapse whitespace and replace by -
    .replace(/\s+/g, '-') 
    // Collapse dashes
    .replace(/-+/g, '-'); 

    return str;
}

export default function NavSection({ navConfig, ...other }) {
  const { pathname } = useLocation();
  const match = (path) => (path ? !!matchPath({ path, end: false }, pathname) : false);

  // console.log(match);

  return (
    <Box {...other}>
      <List disablePadding>
        {navConfig.map((item) => (
          <NavItem 
            key={item.hasOwnProperty("module") ? slugify(item.module) : item.title} 
            item={item} 
            active={match} 
          />
        ))}
      </List>
    </Box>
  );
}
