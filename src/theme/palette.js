import { alpha, darken } from '@mui/material/styles';

// ----------------------------------------------------------------------

function createGradient(color1, color2) {
  return `linear-gradient(to bottom, ${color1}, ${color2})`;
}

// SETUP COLORS
const GREY = {
  0: '#FFFFFF',
  100: '#F9FAFB',
  200: '#F4F6F8',
  300: '#DFE3E8',
  400: '#C4CDD5',
  500: '#919EAB',
  600: '#637381',
  700: '#454F5B',
  800: '#212B36',
  900: '#161C24',
  500_8: alpha('#919EAB', 0.08),
  500_12: alpha('#919EAB', 0.12),
  500_16: alpha('#919EAB', 0.16),
  500_24: alpha('#919EAB', 0.24),
  500_32: alpha('#919EAB', 0.32),
  500_48: alpha('#919EAB', 0.48),
  500_56: alpha('#919EAB', 0.56),
  500_80: alpha('#919EAB', 0.8)
};

const PRIMARY = {
  lighter: alpha('#09366D', 0.2),
  light: alpha('#09366D', 0.4),
  main: '#09366D',
  dark: darken('#09366D', 0.5),
  darker: darken('#09366D', 0.7),
  contrastText: '#FFFFFF'
};
const SECONDARY = {
  lighter: alpha('#464E52', 0.2),
  light: alpha('#464E52', 0.4),
  main: '#464E52',
  dark: darken('#464E52', 0.5),
  darker: darken('#464E52', 0.7),
  contrastText: '#fff'
};
const INFO = {
  lighter: alpha('#00376E', 0.4),
  light: '#7CB9E1',
  main: '#00376E',
  dark: darken('#00376E', 0.5),
  darker: darken('#00376E', 0.7),
  contrastText: '#fff'
};
const SUCCESS = {
  lighter: '#E9FCD4',
  light: '#AAF27F',
  main: '#54D62C',
  dark: '#229A16',
  darker: '#08660D',
  contrastText: GREY[800]
};
const WARNING = {
  lighter: '#FFF7CD',
  light: '#FFE16A',
  main: '#F18A24',
  dark: darken('#F18A24', 0.5),
  darker: darken('#F18A24', 0.7),
  contrastText: GREY[800]
};

const ERROR = {
  lighter: '#FFE7D9',
  light: '#FFA48D',
  main: '#FF4842',
  dark: '#B72136',
  darker: '#7A0C2E',
  contrastText: '#fff'
};

const WHITE = {
  lighter: '#fff',
  light: '#fff',
  main: '#fff',
  dark: '#fff',
  darker: '#fff',
  contrastText: PRIMARY.main
};

const GRADIENTS = {
  primary: createGradient(PRIMARY.light, PRIMARY.main),
  info: createGradient(INFO.light, INFO.main),
  success: createGradient(SUCCESS.light, SUCCESS.main),
  warning: createGradient(WARNING.light, WARNING.main),
  error: createGradient(ERROR.light, ERROR.main)
};

const CHART_COLORS = {
  violet: ['#826AF9', '#9E86FF', '#D0AEFF', '#F7D2FF'],
  blue: ['#2D99FF', '#83CFFF', '#A5F3FF', '#CCFAFF'],
  green: ['#2CD9C5', '#60F1C8', '#A4F7CC', '#C0F2DC'],
  yellow: ['#FFE700', '#FFEF5A', '#FFF7AE', '#FFF3D6'],
  red: ['#FF6C40', '#FF8F6D', '#FFBD98', '#FFF2D4']
};

const palette = {
  common: { black: '#18171D', white: '#fff' },
  primary: { ...PRIMARY },
  secondary: { ...SECONDARY },
  info: { ...INFO },
  success: { ...SUCCESS },
  warning: { ...WARNING },
  error: { ...ERROR },
  grey: GREY,
  gradients: GRADIENTS,
  chart: CHART_COLORS,
  divider: GREY[500_24],
  text: { 
    primary:    GREY[800], 
    secondary:  GREY[600], 
    disabled:   GREY[500],
    white:      WHITE
  },
  background: { 
    paper: '#fff', 
    default: '#fff',
    neutral: GREY[200] 
  },
  white: WHITE,
  action: {
    active: GREY[600],
    hover: GREY[500_8],
    selected: GREY[500_16],
    disabled: GREY[500_80],
    disabledBackground: GREY[500_24],
    focus: GREY[500_24],
    hoverOpacity: 0.08,
    disabledOpacity: 0.48
  }
};

export default palette;
