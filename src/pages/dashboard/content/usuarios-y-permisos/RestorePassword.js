import React, { useEffect, useState } from 'react'
import * as Yup from 'yup';
import { Box, Grid, Container, Typography, Card, CardContent, Button, Modal, TextField, Alert } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

import { alpha, styled } from '@mui/material/styles';
import { Link } from 'react-router-dom';

import axios from "../../../../auth/fetch"
import Loader from '../../../../components/Loader/Loader';

// components
import Page from '../../../../components/Page';
import {
  AppTasks,
  AppNewUsers,
  AppBugReports,
  AppItemOrders,
  AppNewsUpdate,
  AppWeeklySales,
  AppOrderTimeline,
  AppCurrentVisits,
  AppWebsiteVisits,
  AppTrafficBySite,
  AppCurrentSubject,
  AppConversionRates
} from '../../../../components/_dashboard/app';

import { useFormik, Form, FormikProvider } from 'formik';
import { LoadingButton } from '@mui/lab';

// ----------------------------------------------------------------------


const rows = [
    {
        id:     1,
        name:   "angelds301",
        email:  "angelds301@gmail.com",
        token:  "5659"
    },
    {
        id:     2,
        name:   "eperaray",
        email:  "peperarayanany203@gmail.com",
        token:  "0287"
    },
    {
        id:     3,
        name:   "felipelonga",
        email:  "felipelonga@hotmail.com",
        token:  "3378"
    },
    {
        id:     4,
        name:   "Milpoeid",
        email:  "mileidirusobumbum@gmail.com",
        token:  "4096"
    }
];

let heightColumn = 79.7;
heightColumn *= rows.length;

export default function RestorePassword() {

    const [formErrors, setformErrors]       = useState("");
    const [isVerify, setisVerify]           = useState(false);
    const [isVerifyMsg, setisVerifyMsg]     = useState("");

    const [sending, setsending] = useState(false);

    const [loading, setloading] = useState(true);
    const [search, setsearch]   = useState(true);
    const [data, setdata]       = useState(null);

    const [alertSuccessMessage, setalertSuccessMessage] = useState("");
    const [alertErrorMessage,   setalertErrorMessage]   = useState("");

    let urlGetEmailsWithToken    = "/ACCount/ENaBLed/to/RESTAR";
    let urlGetTokenFromEmail     = "/accOunT/passWord/ReSeT/";
    let urlValidateEmail         = "/accoUnt/EmAIl/VALIDAtor/";
    let urlRevokePassword        = "/AcCoUNT/GET/REvOKE/paSSwoRD/";

    const LoginSchema =     Yup.object().shape({
        email:              Yup.string().required('Debe ingresar su email')
    });

    const formik = useFormik({
        initialValues: {
            email:      ""
        },
        validationSchema: LoginSchema,
        onSubmit: async (values, {resetForm}) => {
          try {

            setsending(true);
            setalertErrorMessage("");
            setalertSuccessMessage("");

            axios.get(`${urlValidateEmail+values.email}`)
            .then((res) => {
                if(res.data.result){

                    console.log(res.data);
                    
                    axios.get(`${urlGetTokenFromEmail+values.email}`)
                    .then(async (res) => {
                        if(res.data.result){

                            console.log(res.data);
                            console.log("is validate");

                            await resetForm();
                            await getList();
                            setalertSuccessMessage(res.data.message);


                            setTimeout(() => {
                                setalertSuccessMessage("");
                            }, 10000);
                        }
                    }).catch((err) => {

                        let fetchError = err;

                        console.error(fetchError);
                        if(fetchError.response){
                            console.log(err.response);
                            setalertErrorMessage(err.response.data.message);
                            setsending(false);
                            // return Promise.reject(err.response.data.data);
                        }

                    });

                }
            }).catch((err) => {

                let fetchError = err;

                console.error(fetchError);
                if(fetchError.response){
                    console.log(err.response);
                    setalertErrorMessage(err.response.data.data.message);
                    setsending(false);

                    setTimeout(() => {
                        setalertErrorMessage("");
                    }, 10000);
                    // return Promise.reject(err.response.data.data);
                }

            });
            
          } catch(e) {
            // setformErrors(e);
            setsending(false);
          }
        }
    });

    const { errors, touched, values, isSubmitting, handleSubmit, getFieldProps } = formik;

    const getList = async () => {
        axios.get(urlGetEmailsWithToken)
        .then((res) => {

            console.log("-----");
            console.log(res.data);

            setdata(res.data.data);
            setsending(false);
            setloading(false);

        }).catch((err) => {

            let error = err.response;
            if(error){
                if(error.data){
                    setloading(true);
                }
            }
            
        });
    }

    useEffect(async () => {
        if(loading){
            if(search){
                await getList();
            }
        }
    }, []);

    const revokePassword = (id) => {
        setsending(true);

        axios(`${urlRevokePassword+id}`)
        .then((res) => {
            console.log(res.data);
            if(res.data.result){
                getList();
                setalertSuccessMessage(res.data.message);

                setTimeout(() => {
                    setalertSuccessMessage("");
                }, 10000);
            }
        }).catch((err) => {
            let fetchError = err;

            if(fetchError.response){
                console.log(err.response);
                setalertErrorMessage(err.response.data.message);
                setsending(false);
            }
        });
    }

    const columns = [
        // { field: 'id',          headerName: 'ID', width: 70 },
        { 
            field: 'name',     
            headerName: 'Nombre de usuario',
            width: 250,
            sortable: false
        },
        { 
            field: 'email',    
            headerName: 'Email',
            width: 300,
            sortable: false
        },
        { 
            field: 'hashConfirm',    
            headerName: 'Token',
            sortable: false
        },
        { 
            field: 'id',    
            headerName: '',
            renderCell: (cellValues) => {
                let data = cellValues;
                return  <LoadingButton loading={sending} onClick={() => revokePassword(data.row.id)} variant="contained" color="primary">
                            Revocar
                        </LoadingButton>
            },
            sortable: false
        },
        /*
        {
          field: 'fullName',
          headerName: 'Full name',
          description: 'This column has a value getter and is not sortable.',
          sortable: false,
          width: 160,
          valueGetter: (params) =>
            `${params.row.firstName || ''} ${params.row.lastName || ''}`,
        },
        */
    ];

    return (
        <Page title="Restaurar password | RepuestosGo">
        <Container maxWidth="xl">
            <Box sx={{ pb: 3 }}>
                <Typography variant="h4" color="white.main">
                    Restaurar Password
                </Typography>
            </Box>

            <Grid sx={{ pb: 3 }} item xs={12}>
                {!loading &&
                    <Card>
                        <CardContent>

                            <FormikProvider value={formik}>
                                <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
                                    <Grid container sx={{mb: 3}} columnSpacing={3}>
                                        <Grid item xs={12}>
                                            <Typography sx={{mb: 1}} variant="h6">
                                                Buscar usuario
                                            </Typography>
                                        </Grid>
                                        <Grid sx={{pt: 0}} item xs={12} md={10}>
                                            <TextField 
                                                fullWidth 
                                                size="small" 
                                                id="outlined-basic" 
                                                label="Usuario/email" 
                                                variant="outlined" 
                                                autoComplete="email"
                                                {...getFieldProps('email')}
                                                error={Boolean(touched.email && errors.email)}
                                                helperText={touched.email && errors.email}
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={2}>
                                            <LoadingButton 
                                            type="submit" 
                                            loading={sending} 
                                            fullWidth sx={{px: 5, py: 1}} 
                                            variant="contained" 
                                            color="primary"
                                            >
                                                Restaurar
                                            </LoadingButton>
                                        </Grid>
                                    </Grid>
                                </Form>
                            </FormikProvider>

                            {alertSuccessMessage !== "" &&
                                <Alert sx={{my: 3}} severity="success">
                                    {alertSuccessMessage}
                                </Alert>
                            }

                            {alertErrorMessage !== "" &&
                                <Alert sx={{my: 3}} severity="error">
                                    {alertErrorMessage}
                                </Alert>
                            }

                            {data.length > 0 &&
                                <div>
                            
                                    <div style={{display: 'table', tableLayout:'fixed', width:'100%'}}>
                                        <DataGrid
                                            sx={{mb:3}}
                                            rows={data}
                                            columns={columns}

                                            // page={0}
                                            pageSize={6}
                                            // rowsPerPageOptions={[]}
                                            // autoPageSize
                                            rowCount={rows.length}

                                            disableColumnFilter
                                            disableColumnMenu
                                            autoHeight 
                                            disableColumnSelector
                                            disableSelectionOnClick
                                            // checkboxSelection
                                        />
                                    </div>

                                    {/* 
                                        <div className="text-center">
                                            <Button sx={{px: 5}} variant="contained" color="primary">
                                                Restaurar
                                            </Button>
                                        </div>
                                    */}

                                </div>
                            }

                            {data.length <= 0 &&
                                <Alert severity='info'>
                                    No existen cuentas con token de recuperación
                                </Alert>
                            }
                        </CardContent>
                    </Card>
                }

                {loading &&
                    <Card sx={{py: 3, px: 5}}>
                        <Loader />
                    </Card>
                }
            </Grid>
        </Container>
        </Page>
    );
}
