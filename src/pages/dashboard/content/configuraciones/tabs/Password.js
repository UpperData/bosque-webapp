import React, {useState} from 'react'
import * as Yup from 'yup';
import { Box, Grid, Container, Typography, Divider, Alert, Stack, TextField, Hidden } from '@mui/material';
import ProfileImgUploader from "../../../../../components/uploadImage/ProfileImgUploader"

import { useFormik, Form, FormikProvider } from 'formik';

import { LoadingButton } from '@mui/lab';
import axios from "../../../../../auth/fetch";

import Page from '../../../../../components/Page';

function Info() {

    const [sending, setsending]                         = useState(false);

    const [formErrors, setformErrors]                   = useState("");
    const [alertSuccessMessage, setalertSuccessMessage] = useState("");
    const [alertErrorMessage,   setalertErrorMessage]   = useState("");

    let urlPasswordUpdate = "/PASSwORD/UPDATE";

    const LoginSchema = Yup.object().shape({
        password:           Yup.string().required('Debe ingresar su password'),
        newpassword:        Yup.string().required('Debe ingresar un nuevo password'),
        repeatnewpassword:  Yup.string()
        .required('Repita su password')
        .test('testpass', 'Su password debe coincidir', function checkEnd(val){
           const { newpassword } = this.parent;

            if (newpassword === val) {
              return true;
            }

            return false;
        })
    });

    const formik = useFormik({
        initialValues: {
          password:             '',
          newpassword:          '',
          repeatnewpassword:    ''
        },
        validationSchema: LoginSchema,
        onSubmit: async (values, {resetForm}) => {
            try {
                // setformErrors("");
                // await login(values.email, values.password);

                setsending(true);
                setalertSuccessMessage("");
                setalertErrorMessage("");

                axios({
                    method: "PUT",
                    url: urlPasswordUpdate,
                    data: {
                        currentPassword: values.password,
                        newPassword: values.newpassword
                    }
                }).then((res) => {              

                    if(res.data.result){
                        setalertSuccessMessage(res.data.message);
                        
                    }else{
                        setalertErrorMessage(res.data.message);
                    }
                    setsending(false);
                    resetForm();
                    setTimeout(() => {
                        setalertSuccessMessage("");
                    }, 20000);
                }).catch((err) => {
                    let fetchError = err;
                    if(fetchError.response){                        
                        setalertErrorMessage(err.response.data.message);
                        setTimeout(() => {
                            setalertErrorMessage("");
                        }, 20000);
                        setsending(false);
                    }
                });

            } catch(e) {
                console.log(e);
            }
        }
    });

    const { errors, touched, values, isSubmitting, handleSubmit, getFieldProps } = formik;

    return (
        <Page title="Seguridad | Bosque Marino">
            <Box>
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

                <Grid sx={{ pb: 3 }} item xs={12}>
                    <Grid container alignItems="center" justifyContent="space-between" columnSpacing={3}>
                        <Grid item md={6} xs={12}>
                            <FormikProvider value={formik}>
                                <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
                                    {formErrors !== "" &&
                                        <div>
                                            <Alert sx={{mb: 3}} severity="error">
                                                {formErrors.message}
                                            </Alert>
                                        </div>
                                    }
                                    
                                    <Stack spacing={3} sx={{my: 2}}>
                                        <TextField
                                            size='small'
                                            fullWidth
                                            autoComplete="password"
                                            type="password"
                                            label="Password actual"
                                            {...getFieldProps('password')}
                                            error={Boolean(touched.password && errors.password)}
                                            helperText={touched.password && errors.password}
                                        />
                                    </Stack>

                                    <Stack spacing={3} sx={{my: 2}}>
                                        <TextField
                                            size='small'
                                            fullWidth
                                            autoComplete="newpassword"
                                            type="password"
                                            label="Nuevo password"
                                            {...getFieldProps('newpassword')}
                                            error={Boolean(touched.newpassword && errors.newpassword)}
                                            helperText={touched.newpassword && errors.newpassword}
                                        />
                                    </Stack>

                                    <Stack spacing={3}>
                                        <TextField
                                            size='small'
                                            fullWidth
                                            autoComplete="repeatnewpassword"
                                            type="password"
                                            label="Repita Nuevo password"
                                            {...getFieldProps('repeatnewpassword')}
                                            error={Boolean(touched.repeatnewpassword && errors.repeatnewpassword)}
                                            helperText={touched.repeatnewpassword && errors.repeatnewpassword}
                                        />
                                    </Stack>

                                    <LoadingButton
                                        fullWidth
                                        size="large"
                                        type="submit"
                                        variant="contained"
                                        loading={sending}
                                        color="primary"
                                        sx={{mt: 5}}
                                    >
                                        Cambiar Password
                                    </LoadingButton>
                                </Form>
                            </FormikProvider>
                        </Grid>
                        
                        <Hidden mdDown>
                            <>
                                <Divider orientation="vertical" flexItem style={{marginRight:"-1px"}} />
                                
                                <Grid item md={5} xs={12}>
                                    
                                    <img src="/static/password.png" alt="Informacion de perfil" />
                                    
                                </Grid>
                            </>
                        </Hidden>
                    </Grid>
                </Grid>
            </Box>
        </Page>
    )
}

export default Info