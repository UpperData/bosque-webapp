import React, { useEffect, useState } from 'react'
import * as Yup from 'yup';
import { Box, Grid, Container, Typography, Divider, Alert, Stack, TextField, Button, Modal, Hidden } from '@mui/material';
import ProfileImgUploader from "../../../../../components/uploadImage/ProfileImgUploader"

import {useSelector, useDispatch} from "react-redux"
import { useFormik, Form, FormikProvider } from 'formik';
import { LoadingButton } from '@mui/lab';

import axios from "../../../../../auth/fetch"
import Loader from '../../../../../components/Loader/Loader';

function Email() {

    const [formErrors, setformErrors]       = useState("");
    const [isVerify, setisVerify]           = useState(false);
    const [isVerifyMsg, setisVerifyMsg]     = useState("");

    const [showModalConfirm, setshowModalConfirm] = useState(false);

    const [sending, setsending] = useState(false);

    const [loading, setloading] = useState(true);
    const [search, setsearch]   = useState(true);
    const [data, setdata]       = useState(null);

    const [alertSuccessMessage, setalertSuccessMessage] = useState("");
    const [alertErrorMessage,   setalertErrorMessage]   = useState("");

    const userData          = useSelector(state => state.session.userData.data);

    let urlIsVerifyEmail    = "/EMAIl/STaTus/veriFy/";
    let urlUpdateEmail      = "/acCOUNT/EmaIl/UPDATE";

    const verifyEmail = async () => {
        axios.get(urlIsVerifyEmail)
        .then((res) => {

            console.log("-----");

            console.log(res.data);
            setisVerify(true);
            setisVerifyMsg(res.data.message);
            setloading(false);

        }).catch((err) => {

            let error = err.response;
            if(error){
                if(error.data){
                    console.error(error.data.data);
                    setisVerifyMsg(error.data.data.message);
                    setisVerify(error.data.data.result);
                    setloading(false);
                }
            }
            
        });
    }

    useEffect(async () => {
        if(loading){
            if(search){
                await verifyEmail();
            }
        }
     }, []);

    const LoginSchema = Yup.object().shape({
        password:        Yup.string().required('Debe ingresar su password'),
        newEmail:        Yup.string().required('Debe ingresar un nuevo email').email("Verifique el formato de su correo"),
        repeatNewEmail:  Yup.string().required('Repita su email para confirmar')
        .test('testemail', 'Su email debe coincidir', function checkEnd(val){
            const { newEmail } = this.parent;
 
            if (newEmail === val) {
            return true;
            }
 
            return false;
        })
    });

    const style = {
        width: "95%",
        margin: "auto",
        maxWidth: "600px",
        backgroundColor: "#fff",
        userSelect: "none",
        boxShadow: 'none',
        textAlign: 'center',
    };

    const formik = useFormik({
        initialValues: {
          password:             '',
          newEmail:             '',
          repeatNewEmail:       ''
        },
        validationSchema: LoginSchema,
        onSubmit: async (values, {resetForm}) => {
          try {
            // setformErrors("");
            // await login(values.email, values.password);

            // falta implementar el mensaje de satisfaccion

            // let urlEmailUpdate = `/acCOUNT/EmaIl/UPDATE?currentPassword=${values.password}&newEmail=${values.newEmail}`;
            
            setalertSuccessMessage("");
            setalertErrorMessage("");
            setsending(true);

            axios({
                method: "PUT",
                url: urlUpdateEmail,
                data: {
                    currentPassword: values.password,
                    newEmail: values.newEmail
                }
            }).then((res) => {
                console.log(res.data);
                setsending(false);

                if(res.data.result){
                    setalertSuccessMessage(res.data.message);
                    resetForm();
                    verifyEmail();
                    setshowModalConfirm(false);

                    setTimeout(() => {
                        setalertSuccessMessage("");
                    }, 30000);
                }

            }).catch((err) => {
                let fetchError = err;

                console.error(fetchError);
                if(fetchError.response){
                    console.log(err.response);
                    setalertErrorMessage(err.response.data.data.message);
                    setsending(false);
                    setshowModalConfirm(false);
                    // return Promise.reject(err.response.data.data);
                }
            });
            
          } catch(e) {
            // setformErrors(e);
          }
        }
    });

    const { errors, touched, values, isSubmitting, handleSubmit, getFieldProps } = formik;

    if(!loading){

        return (
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

                                    <Box sx={{mb:3}}>
                                        <Typography sx={{fontWeight: "bold"}}>
                                            Email activo:
                                        </Typography>
                                        <Typography sx={{mb:3}}>
                                            {userData.account.email}
                                        </Typography>
                                    </Box>
                                    
                                    <Stack spacing={3} sx={{my: 2}}>
                                        <TextField
                                            size='small'
                                            fullWidth
                                            autoComplete="password"
                                            type="password"
                                            label="Ingrese su password"
                                            {...getFieldProps('password')}
                                            error={Boolean(touched.password && errors.password)}
                                            helperText={touched.password && errors.password}
                                        />
                                    </Stack>

                                    <Stack spacing={3} sx={{my: 2}}>
                                        <TextField
                                            size='small'
                                            fullWidth
                                            autoComplete="newEmail"
                                            type="text"
                                            label="Nuevo email"
                                            {...getFieldProps('newEmail')}
                                            error={Boolean(touched.newEmail && errors.newEmail)}
                                            helperText={touched.newEmail && errors.newEmail}
                                        />
                                    </Stack>

                                    <Stack spacing={3}>
                                        <TextField
                                            size='small'
                                            fullWidth
                                            autoComplete="repeatNewEmail"
                                            type="text"
                                            label="Repita email"
                                            {...getFieldProps('repeatNewEmail')}
                                            error={Boolean(touched.repeatNewEmail && errors.repeatNewEmail)}
                                            helperText={touched.repeatNewEmail && errors.repeatNewEmail}
                                        />
                                    </Stack>

                                    <Button
                                        fullWidth
                                        size="large"
                                        type="button"
                                        variant="contained"
                                        loading={sending}
                                        sx={{mt: 5}}
                                        onClick={() => (values.password !== "" && values.newEmail !== "" && values.repeatNewEmail !== "") ? setshowModalConfirm(true) : handleSubmit()}
                                    >
                                        Actualizar Email
                                    </Button>

                                    <Modal
                                        open={showModalConfirm}
                                        onClose={() => setshowModalConfirm(false)}
                                        aria-labelledby="modal-modal-title"
                                        aria-describedby="modal-modal-description"
                                        style={{ 
                                            display:'flex', 
                                            alignItems:'center', 
                                            justifyContent:'center' 
                                        }}
                                    >
                                        <Box sx={{...style, p: 5, borderRadius: 2}}>
                                            <Typography variant="h5" alignItems="center" sx={{mb: 3}}>
                                                ¿Desea actualizar su email?
                                            </Typography>
                                            <div>
                                                <LoadingButton
                                                    size="large"
                                                    variant="contained"
                                                    loading={sending}
                                                    color="primary" 
                                                    onClick={() => handleSubmit()}
                                                    sx={{mx: 1}}
                                                >
                                                    Actualizar Email
                                                </LoadingButton>
                                                <Button size="large" sx={{mx: 1}} onClick={() => setshowModalConfirm(false)}>
                                                    Cancelar
                                                </Button>
                                            </div>
                                        </Box>
                                    </Modal>

                                </Form>
                            </FormikProvider>
                        </Grid>

                        <Hidden mdDown>
                            <>
                                <Divider orientation="vertical" flexItem style={{marginRight:"-1px"}} />
                                
                                <Grid item md={5} xs={12}>
                                    
                                    {(!isVerify)
                                        ?
                                        <div>
                                            <Alert sx={{mb: 3}} severity="info">
                                                {isVerifyMsg}
                                            </Alert>
                                            <Button disabled fullWidth variant="contained" size="large" color="secondary">
                                                Certificar Email
                                            </Button>
                                        </div>
                                        :
                                        <div>
                                            <Box sx={{width: "100%", maxWidth: "250px", margin: "auto"}}>
                                                <img src="/static/check.png" alt="Cuenta verificada" />
                                            </Box>
                                            <Typography sx={{pt: 2, fontWeight: "bold"}} component="h4" align='center'>
                                                {isVerifyMsg}
                                            </Typography>
                                        </div>
                                    }
                                </Grid>
                            </>
                        </Hidden>
                    </Grid>
                </Grid>
            </Box>
        )
    }

    return <Loader />
}

export default Email