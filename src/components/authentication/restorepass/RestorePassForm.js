import * as Yup from 'yup';
import { useState } from 'react';
import { Link as RouterLink, Navigate } from 'react-router-dom';
import { useFormik, Form, FormikProvider } from 'formik';
import ReCAPTCHA from "react-google-recaptcha";

import { Icon } from '@iconify/react';

import eyeFill from '@iconify/icons-eva/eye-fill';
import eyeOffFill from '@iconify/icons-eva/eye-off-fill';
// material
import {
  Link,
  Stack,
  Checkbox,
  TextField,
  IconButton,
  InputAdornment,
  FormControlLabel,
  Box,
  Alert,
  Grid,
  Button,
  Divider,
  Typography
} from '@mui/material';

import { useAuth } from "../../../auth/AuthProvider";
import { LoadingButton } from '@mui/lab';
import axios from '../../../auth/fetch'

// ----------------------------------------------------------------------

export default function RestorePassForm() {

  const [showPassword, setShowPassword]               = useState(false);

  // const [email, setemail]                          = useState("");

  const [success, setsuccess]                         = useState(false);
  const [sending, setsending]                         = useState(false);

  const [verify, setverify]                           = useState(false);
  const [validEmail, setvalidEmail]                   = useState(false);

  const [formErrors, setformErrors]                   = useState("");

  const [secretQuestions, setsecretQuestions]         = useState(null);

  const [alertSuccessMessage, setalertSuccessMessage] = useState("");
  const [alertErrorMessage,   setalertErrorMessage]   = useState("");

  const [captchaTkn, setcaptchaTkn]                   = useState("");

  const urlChangePassword                             = "/PASSwORD/RestarRT";

  function onChangeCaptcha(value) {
    console.log("Captcha value:", value);
    if(value !== undefined && value !== null){
      setcaptchaTkn(value);
    }
  }

  const validateEmail = (email) => {
    let url = `/accoUnt/EmAIl/VALIDAtor/${email}`;
    let urlGetSecretQuestions = `/aCCoUnt/EMAIl/Get/QUEStIOns/${email}`;

    setalertSuccessMessage("");
    setalertErrorMessage("");
    setverify(true);

    axios.get(url)
    .then((res) => {        
        console.log(res.data);
        if(res.data.result){
          // get questions
          axios.get(urlGetSecretQuestions)
          .then((res) => {
              console.log(res.data);

              if(res.data.result){
                setsecretQuestions(res.data.data);
                setvalidEmail(true);
                setverify(false);
              }else{
                setverify(false);
                setvalidEmail(false);
                setalertErrorMessage(res.data.data.message);
              }

          }).catch((err) => {
              let error = err.response;
              if(error){
                  if(error.data){
                      console.error(error.data.data);
                      setalertErrorMessage(error.data.data.message);
                  }
              }

              setverify(false);
          });
        }
    }).catch((err) => {
        let error = err.response;
        if(error){
            if(error.data){
                console.error(error.data.data);
                setalertErrorMessage(error.data.data.message);
            }
        }

        setverify(false);
    });
  }

  const LoginSchema = Yup.object().shape({
    email:    Yup.string().email('Verifique el formato de su email').required('Su email es requerido'),
    token:    Yup.string().required('Ingrese su token de seguridad'),
    newpassword: Yup.string().required('Ingrese su nuevo password'),

    firstResponse: Yup.string().required('Responda a la pregunta de seguridad'),
    secondResponse: Yup.string().required('Responda a la pregunta de seguridad'),
  });

  const formik = useFormik({
    initialValues: {
      email: '',
      token: '',
      newpassword: '',
      firstResponse: '',
      secondResponse: ''
    },
    validationSchema: LoginSchema,
    onSubmit: async (values, {resetForm}) => {
      try {
        setformErrors("");
        setsending(true);
        setsuccess(false);

        axios({
          method: "POST",
          url: urlChangePassword,
          data: {
            email:        values.email,
            newPassword:  values.newpassword,
            secret:[
              values.firstResponse, 
              values.secondResponse
            ],
            token:        values.token
          }
        }).then((res) => {

            setsending(false);
            if(res.data !== null){
              if(res.data.result){
                setalertSuccessMessage(res.data.message);
                setsuccess(true);
              }
            }

        }).catch((err) => {

            setsending(false);
            let fetchError = err;
            console.error(fetchError);
            if(fetchError.response){
              setalertErrorMessage(err.response.data.data.message);
            }

        });

      } catch(e) {
        setformErrors(e);
        console.log("Ha ocurrido un error al validar usuario");
      }
    }
  });

  const { errors, touched, values, isSubmitting, handleSubmit, getFieldProps } = formik;

  const handleShowPassword = () => {
    setShowPassword((show) => !show);
  };

  const changeEmail = () => {
    setverify(false);
    setvalidEmail(false);
  }

  const changeCaptcha = (val) => {

  }

  if(!success){
    return (
      <FormikProvider value={formik}>
        <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
          {formErrors !== "" &&
            <div>
              <Alert sx={{mb: 3}} severity="error">
                {formErrors.message}
              </Alert>
            </div>
          }

          {alertSuccessMessage !== "" &&
              <Alert sx={{mb: 3}} severity="success">
                  {alertSuccessMessage}
              </Alert>
          }

          {alertErrorMessage !== "" &&
              <Alert sx={{mb: 3}} severity="error">
                  {alertErrorMessage}
              </Alert>
          }

          <div>
            {!validEmail &&
                <Grid container columnSpacing={3}>
                  <Grid item md={9}>
                    <TextField
                      fullWidth
                      autoComplete="username"
                      type="text"
                      label="Número de cédula"

                      // value={email}
                      // onChange={(e) => setemail(e.target.value)}

                      {...getFieldProps('email')}
                      error={Boolean(touched.email && errors.email)}
                      helperText={touched.email && errors.email}
                    />
                  </Grid>
                  <Grid item md={3}>
                    <LoadingButton 
                      sx={{py: 3.5}} 
                      size='large' 
                      variant='contained' 
                      color="primary"
                      onClick={() => validateEmail(values.email)}
                      type="button"
                      loading={verify}
                      // disabled={captchaTkn === ""}
                    >
                      Validar
                    </LoadingButton>
                  </Grid>
                </Grid>
            }

            <Box sx={{mt:3}}>
              {/* !validEmail &&
                <ReCAPTCHA
                  sitekey={process.env.REACT_APP_GOOGLE_KEY_CAPTCHA}
                  onChange={(value) => onChangeCaptcha(value)}
                />     
              */}
            </Box>

            {validEmail &&
              <Grid container columnSpacing={3}>
                <Grid item md={9}>
                  <TextField
                    fullWidth
                    autoComplete="username"
                    type="email"
                    label="Email"
                    color="success"
                    focused 
                    // value={email}
                    // onChange={(e) => setemail(e.target.value)}
                    InputProps={{
                      readOnly: true,
                    }}
                    {...getFieldProps('email')}
                    error={Boolean(touched.email && errors.email)}
                    helperText={touched.email && errors.email}
                  />
                </Grid>
                <Grid item md={3}>
                  <Button 
                    sx={{py: 3.5}} 
                    size='large' 
                    variant='contained' 
                    color="secondary"
                    onClick={() => changeEmail()}
                    type="button"
                  >
                    Cambiar
                  </Button>
                </Grid>
              </Grid>
            }
          </div>

          {/* FORMULARIO */}

          {validEmail &&
            <div>
              <Stack spacing={3} sx={{mt: 3}}>
                  <TextField
                    fullWidth
                    autoComplete="token"
                    type="text"
                    label="Token"
                    {...getFieldProps('token')}
                    error={Boolean(touched.token && errors.token)}
                    helperText={touched.token && errors.token}
                  />
              </Stack>

              <Stack spacing={3} sx={{mt: 3}}>
                  <TextField
                    fullWidth
                    autoComplete="newpassword"
                    type="password"
                    label="Nuevo Password"
                    {...getFieldProps('newpassword')}
                    error={Boolean(touched.newpassword && errors.newpassword)}
                    helperText={touched.newpassword && errors.newpassword}
                  />
              </Stack>
            </div>
          }

          {validEmail &&
            <div>
              <Divider sx={{mt: 3}} />

              <Typography variant="h5" sx={{ py: 3, fontWeight: "bold" }}>
                Preguntas de seguridad
              </Typography>

              <Stack spacing={1}>
                  <Typography variant="p" sx={{ fontWeight: "normal", m:0, p:0 }}>
                    {secretQuestions[0]}
                  </Typography>
                  <TextField
                    fullWidth
                    autoComplete="firstResponse"
                    type="text"
                    label="Respuesta"
                    {...getFieldProps('firstResponse')}
                    error={Boolean(touched.firstResponse && errors.firstResponse)}
                    helperText={touched.firstResponse && errors.firstResponse}
                  />
              </Stack>

              <Stack spacing={1} sx={{mt: 3}}>
                <Typography variant="p" sx={{ fontWeight: "normal", m:0, p:0 }}>
                  {secretQuestions[1]}
                </Typography>
                  <TextField
                    fullWidth
                    autoComplete="secondResponse"
                    type="text"
                    label="Respuesta"
                    {...getFieldProps('secondResponse')}
                    error={Boolean(touched.secondResponse && errors.secondResponse)}
                    helperText={touched.secondResponse && errors.secondResponse}
                  />
              </Stack>
            </div>
          }

          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mt: 3 }}>
            <Typography>
              Si ha recuperado su contraseña puede probar
              <Link component={RouterLink} variant="subtitle2" sx={{ml:1}} 
              // color="" 
              to="/login"
              >
                Iniciar sesion
              </Link>
            </Typography>
          </Stack>

          {validEmail &&
            <LoadingButton
              fullWidth
              size="large"
              type="submit"
              variant="contained"
              loading={sending}
              color="secondary"
              sx={{mt: 5}}
              // disabled={!validEmail}
            >
              Restaurar Password
            </LoadingButton>
          }
        </Form>
      </FormikProvider>
    );
  }

  return (
    <Navigate to="/restore-password/success" replace />
  )
}
