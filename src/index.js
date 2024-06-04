// scroll bar
import 'simplebar/src/simplebar.css';

import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Provider } from 'react-redux';
import { AuthProvider } from './auth/AuthProvider'

import { GoogleReCaptchaProvider} from 'react-google-recaptcha-v3';

import './styles/app.scss'
import 'react-toastify/dist/ReactToastify.css';

import { ToastContainer } from 'react-toastify';

// store
import store from './store/store';

//
import App from './App';
import * as serviceWorker from './serviceWorker';
import reportWebVitals from './reportWebVitals';

// ----------------------------------------------------------------------

ReactDOM.render(
  <Provider store={store}>
    <AuthProvider>
      <HelmetProvider>
        <BrowserRouter>
          <ToastContainer />
          <App />
          
        </BrowserRouter>
      </HelmetProvider>
    </AuthProvider>
  </Provider>,
  document.getElementById('root')
);

// If you want to enable client cache, register instead.
serviceWorker.unregister();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
