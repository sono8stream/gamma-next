import { createMuiTheme,MuiThemeProvider } from '@material-ui/core/styles';

const theme = createMuiTheme({
  type: 'light',
  palette: {
    primary: {
      light: '#63A4FF',
      main: '#1976D2',
      dark: '#004BA0',
    },
    secondary: {
      light: '#FF5C8D',
      main: '#D81B60',
      dark: '#A00037',
    },
  },
});

const ThemeProvider = ({ children }) => (
  <MuiThemeProvider theme={theme}>
    {children}
  </MuiThemeProvider>
);

export default ThemeProvider;