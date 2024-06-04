import React, { useEffect, useState } from 'react'
import axios from "../../../../auth/fetch"
import moment from "moment"
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import * as Yup from 'yup';

import { useFormik, Form, FormikProvider } from 'formik';
import { LoadingButton, DatePicker, LocalizationProvider  } from '@mui/lab';
import { Link as RouterLink } from 'react-router-dom';
import { useSelector } from "react-redux";
import { CardContent, Hidden, Link, Box, Grid, Container, Typography, Card, Button, Modal, TextField, Alert, Divider, List, ListItem, ListItemButton, ListItemText } from '@mui/material';
// import { DataGrid } from '@mui/x-data-grid';

import Scrollbar from "../../../../components/Scrollbar";
import Loader from '../../../../components/Loader/Loader';
import Page from '../../../../components/Page';

import {AgendaPdf} from "./pdf/Agenda";
import { PDFDownloadLink, BlobProvider } from "@react-pdf/renderer";
import printJS from 'print-js'

export default function Agenda() {

    const [sending, setsending] = useState(false);
    const [loading, setloading] = useState(true);
    const [search, setsearch]   = useState(true);
    const [data, setdata]       = useState(null);

    const [appoinmentSelected, setappoinmentSelected]   = useState(null);

    const [alertSuccessMessage, setalertSuccessMessage] = useState("");
    const [alertErrorMessage,   setalertErrorMessage]   = useState("");

    const [dateSearch, setdateSearch]                   = useState(moment().format("MM/DD/YYYY"));

    const [doctors, setdoctors]                         = useState(null);
    const [nurses, setnurses]                           = useState(null);

    // SearchData
    const [textSearchData, settextSearchData]   = useState("");
    const [searchingData, setsearchingData]     = useState(false);

    const civilStatusTypesList  = useSelector(state => state.dashboard.civilStatusTypes.data.data);
    // const phoneTypesList        = useSelector(state => state.dashboard.phoneTypesList.data.data);
    const patientTypes          = useSelector(state => state.dashboard.patientTypes.data.data);
    const appointmentTypes      = useSelector(state => state.dashboard.appointmentTypes.data.data);

    let urlGetData              = "/aPpoINtMent/by/DATE/";
    const urlGetPersonal        = "/EMplOyeFIle/BYGRoUP/get/?grp=7&grp=6";

    const printFile = async (blob) => {
        let pdfUrl    = await window.URL.createObjectURL(blob);
        await printJS(pdfUrl);
        window.URL.revokeObjectURL(pdfUrl);
    }

    const LoginSchema =     Yup.object().shape({
        text:               Yup.string().required('')
    });

    const formik = useFormik({
        initialValues: {
            text:      ""
        },
        validationSchema: LoginSchema,
        onSubmit: async (values, {resetForm}) => {
          try {

            setsending(true);
            setalertErrorMessage("");
            setalertSuccessMessage("");
            
          } catch(e) {
            setsending(false);
          }
        }
    });

    const { errors, touched, values, isSubmitting, handleSubmit, getFieldProps } = formik;

    const getList = async () => {

        setsearch(true);
        let url = urlGetData+moment(dateSearch, "MM/DD/YYYY").format("YYYY-MM-DD"); 
        // console.log(moment(dateSearch, "MM/DD/YYYY").format("YYYY-MM-DD"));
        
        axios.get(url)
        .then((res) => {

            console.log("---Data---");
            console.log(res.data);

            if(res.data.data){
                setdata(res.data.data);
                if(res.data.data.rows.length > 0){
                    setappoinmentSelected(res.data.data.rows[0]);
                }else{
                    setappoinmentSelected(null);
                }
            }

            // Empleados (medico, enfermera)
            axios.get(urlGetPersonal)
            .then((res) => {
                console.log("PERSONAL", res.data);
                let dataList = res.data.data;

                if(dataList.length > 0){
                    setdoctors( dataList.find(item => item.roleId === 6).accountRoles);
                    setnurses(  dataList.find(item => item.roleId === 7).accountRoles);
                }

                setsearch(false);
                setsending(false);
                setloading(false);

            }).catch((err) => {
                console.error(err);
            });


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

    // console.log(appointmentTypes);

    let doctorInDateSelected    = "";
    let nurseInDateSelected     = "";

    if(appoinmentSelected !== null){
        if(doctors !== null && nurses !== null){
            // console.log(doctors);
            doctorInDateSelected = doctors.find(doctor => doctor.account.employeeFiles.length > 0 && doctor.account.employeeFiles[0] && Number(doctor.account.employeeFiles[0].id) === Number(appoinmentSelected.medialPersonal.doctor.employeeId));
            if(doctorInDateSelected !== undefined){
                doctorInDateSelected = doctorInDateSelected.account.employeeFiles[0].fisrtName+" "+doctorInDateSelected.account.employeeFiles[0].lastName;
            }

            nurseInDateSelected = nurses.find(nurse => nurse.account.employeeFiles.length > 0 && nurse.account.employeeFiles[0] && Number(nurse.account.employeeFiles[0].id) === Number(appoinmentSelected.medialPersonal.nurses.employeeId));
            if(nurseInDateSelected !== undefined){
                nurseInDateSelected = nurseInDateSelected.account.employeeFiles[0].fisrtName+" "+nurseInDateSelected.account.employeeFiles[0].lastName;
            }
        }
    }
    
    return (
        <Page title="Agenda | RepuestosGo">
        <Container maxWidth="xl">
            <Box sx={{ pb: 3 }}>
                <Typography variant="h4">
                    Agenda
                </Typography>
            </Box>

            <Grid sx={{ pb: 3 }} item xs={12}>
                {!loading &&
                    <Card>
                        <CardContent>

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

                            <Box>
                                <Grid container columnSpacing={3}>

                                    <Grid sx={{mb: 2}} item md={4} xs={12}>
                                        <Grid container columnSpacing={1}>
                                            <Grid item md={9}>
                                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                                    <DatePicker
                                                        label="Buscar fecha"
                                                        value={dateSearch}
                                                        onChange={(value) => {
                                                            setdateSearch(value);
                                                        }}
                                                        
                                                        renderInput={
                                                            (params) => <TextField 
                                                                        fullWidth
                                                                        size='small' 
                                                                        // {...getFieldProps('birthday')}
                                                                        // helperText={touched.birthday && errors.birthday} 
                                                                        // error={Boolean(touched.birthday && errors.birthday)} 
                                                                        {...params} 
                                                            />
                                                        }
                                                    />
                                                </LocalizationProvider>
                                            </Grid>
                                            <Grid item md={3}>
                                                <LoadingButton 
                                                    variant="contained" 
                                                    color="primary"
                                                    type="button"
                                                    sx={{ minWidth: "100%", width: "100%"}}
                                                    onClick={() => getList()}
                                                    loading={search}
                                                    // disabled={textSearchData === "" || !permissions.consulta}
                                                >
                                                    <i className="mdi mdi-magnify" />
                                                </LoadingButton>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                    <Grid sx={{mb: 2}} item md={4} xs={6}>
                                        {appoinmentSelected !== null ?
                                                <BlobProvider 
                                                    document={<AgendaPdf data={{...data, date: dateSearch, appointmentTypes, doctors, nurses}} />}
                                                >
                                                    {({ blob, url, loading, error }) => {
                                                        console.log(blob);
                                                        // Do whatever you need with blob here
                                                        return <Button 
                                                            onClick={() => printFile(blob)} 
                                                            // disabled={!permissions.imprime || typeForm === "create"} 
                                                            variant="contained" fullWidth
                                                        >
                                                            Imprimir
                                                        </Button>
                                                    }}
                                                </BlobProvider>
                                            :
                                                <Button 
                                                    disabled
                                                    variant="contained" fullWidth
                                                >
                                                    Imprimir
                                                </Button>
                                            }
                                    </Grid>
                                    <Grid sx={{mb: 2}} item md={4} xs={6}>
                                        <Button 
                                            disabled={appoinmentSelected === null} 
                                            variant="contained" 
                                            color="secondary" 
                                            fullWidth    
                                            className={appoinmentSelected !== null ? "pdf-download-link" : ""}
                                        >   
                                            {appoinmentSelected !== null ?
                                                <PDFDownloadLink
                                                    document={<AgendaPdf data={{...data, date: dateSearch, appointmentTypes, doctors, nurses}} />}
                                                    fileName="cita_agenda.pdf"
                                                >
                                                    Descargar
                                                </PDFDownloadLink>
                                                :
                                                "Descargar"
                                            }
                                        </Button>
                                    </Grid>

                                </Grid>

                            </Box>

                            {search &&
                                <Box sx={{py: 3, px: 5}}>
                                    <Loader />
                                </Box>
                            }

                            {data.rows.length <= 0 && !search &&
                                <Alert sx={{my: 3}} severity="info">
                                    <p>
                                        No se han encontrado citas agendadas para el día de hoy.  Puede revisar otras mediante la busqueda de la barra superior.
                                    </p>
                                </Alert>
                            }
                            
                            {data.rows.length > 0 && !search &&
                                <Box>
                                    <Grid container columnSpacing={3}>
                                        <Grid item lg={4} xs={12} sx={{mb: 2}}>

                                            <Typography fontWeight="700" sx={{mb: 3}}>
                                                Lista de citas disponibles:
                                            </Typography>
                                            {data.rows.length > 0 &&
                                                <Scrollbar
                                                    sx={{
                                                        height: "auto",
                                                        '& .simplebar-content': { maxHeight: 320 ,height: "auto", display: 'flex', flexDirection: 'column' }
                                                    }}
                                                >
                                                {data.rows.map((date, key) => {
                                                    let item = date;
                                                    // let hour = new Date(item.hourAppointment).toString();
                                                    let hour = moment(item.hourAppointment).format("hh:mm A");

                                                    return <ListItem 
                                                            sx={{ background: appoinmentSelected === item ? "primary" : "" }} 
                                                            disablePadding
                                                            key={key}
                                                        >
                                                            <ListItemButton 
                                                                selected={appoinmentSelected === item} 
                                                                onClick={() => setappoinmentSelected(item)}
                                                                className='w-100'
                                                            >
                                                                <div className='w-100 position-relative'>
                                                                    <Typography className='item-hour' color="text.secondary" sx={{fontSize: 12}} fontWeight="700" align='right'>
                                                                        {hour} 
                                                                    </Typography>
                                                                    <Typography fontWeight="700" align='center'>
                                                                        {item.foreignId} 
                                                                    </Typography>
                                                                    <Typography align='center'>
                                                                        {item.address.estado.name+" - "+item.address.ciudad.name} 
                                                                    </Typography>
                                                                    <Typography fontWeight="700" align='center'>
                                                                        {item.patient.nombre+" "+item.patient.apellido} 
                                                                    </Typography>
                                                                </div>
                                                            </ListItemButton>
                                                        </ListItem>
                                                })}
                                                </Scrollbar>
                                            }

                                        </Grid>
                                        <Grid item lg={8} xs={12} sx={{mb: 3}}>
                                            <Hidden mdDown>
                                                <Grid sx={{mb: 2}} container columnSpacing={3}>
                                                    <Grid item md={2}>
                                                        <Typography color="primary" sx={{fontSize: 40}}>
                                                            <i className='mdi mdi-alarm' />
                                                        </Typography>
                                                    </Grid>
                                                    <Grid item md={5}>
                                                        <Typography sx={{fontSize: 40, fontWeight: 700}}>
                                                            {appoinmentSelected.foreignId} 
                                                        </Typography>
                                                    </Grid>
                                                    <Grid item md={5}>
                                                        <Typography sx={{fontSize: 40, fontWeight: 700}} align="right">
                                                            {moment(appoinmentSelected.hourAppointment).format("hh:mm")}
                                                        </Typography>
                                                    </Grid>
                                                </Grid>
                                            </Hidden>

                                            <Hidden mdUp>
                                                <>
                                                    <Divider />
                                                    <Grid sx={{mb: 1, pt: 3}} container columnSpacing={3}>
                                                        <Grid item lg={3} xs={2}>
                                                            <Typography color="primary" sx={{fontSize: 30}}>
                                                                <i className='mdi mdi-alarm' />
                                                            </Typography>
                                                        </Grid>
                                                        <Grid item lg={4} xs={5}>
                                                            <Typography sx={{fontSize: 30, fontWeight: 700}}>
                                                                {appoinmentSelected.foreignId} 
                                                            </Typography>
                                                        </Grid>
                                                        <Grid item lg={5} xs={5}>
                                                            <Typography sx={{fontSize: 30, fontWeight: 700}}>
                                                                {moment(appoinmentSelected.hourAppointment).format("hh:mm")}
                                                            </Typography>
                                                        </Grid>
                                                    </Grid>
                                                </>
                                            </Hidden>

                                            <Typography>
                                                <Typography component="span">
                                                    ID: <Typography component="span" sx={{fontWeight: 700}}>{appoinmentSelected.id}</Typography>
                                                </Typography>

                                                <Typography sx={{ml: 2}} component="span">
                                                    Siniestro: <Typography component="span" sx={{fontWeight: 700}}>{appoinmentSelected.foreignId}</Typography>
                                                </Typography>

                                                <Typography sx={{ml: 2}} component="span">
                                                    Tipo: <Typography component="span" sx={{fontWeight: 700}}>{appointmentTypes.find(item => item.id === Number(appoinmentSelected.appointmentTypeId)).name}</Typography>
                                                </Typography>
                                            </Typography>

                                            <Box sx={{my: 2}}>
                                                <Divider />
                                            </Box>

                                            <Typography sx={{mb: 2}}>

                                            <Hidden mdDown>
                                                <Link component={RouterLink} to={"/dashboard/CITaS/historyByPatient/"+appoinmentSelected.patient.id} sx={{ textDecoration: "none", color: "#000" }}>
                                                    <Typography color="text.body" component="span" >
                                                        Paciente: <Typography component="span" sx={{fontWeight: 700}}>
                                                            {appoinmentSelected.patient.nombre+" "+appoinmentSelected.patient.apellido} (71 años) – Clic para ver Historia
                                                        </Typography>
                                                    </Typography>
                                                </Link>
                                            </Hidden>

                                            <Hidden mdUp>
                                                <Link component={RouterLink} to={"/dashboard/CITaS/historyByPatient/"+appoinmentSelected.patient.id} sx={{ textDecoration: "none", color: "#000" }}>
                                                    <Typography color="text.body" component="h6" >
                                                        Paciente
                                                    </Typography>
                                                    <Typography component="span" sx={{fontWeight: 700}}>
                                                        {appoinmentSelected.patient.nombre+" "+appoinmentSelected.patient.apellido} (71 años) – ver
                                                    </Typography>
                                                </Link>
                                            </Hidden>
                                                

                                            </Typography>

                                            <Typography sx={{mb: 2}}>
                                                
                                                <Typography component="span">
                                                    Tipo: <Typography component="span" sx={{fontWeight: 700}}>{patientTypes.find(item => item.id === Number(appoinmentSelected.patient.patientTypeId)).name}</Typography>
                                                </Typography>

                                                <Typography sx={{ml: 2}} component="span">
                                                    TLF: <Typography component="span" sx={{fontWeight: 700}}>{appoinmentSelected.patient.phone[0].phoneNumber}</Typography>
                                                </Typography>

                                            </Typography>

                                            <Typography sx={{mb: 2}}>
                                                <Typography component="span">
                                                    Dirección: <Typography component="span" sx={{fontWeight: 700}}>Edo. {appoinmentSelected.address.estado.name}, Municipio {appoinmentSelected.address.municipio.name}, {appoinmentSelected.address.ciudad.name}, Parroquia {appoinmentSelected.address.parroquia.name}, {appoinmentSelected.address.address}</Typography>
                                                </Typography>
                                            </Typography>

                                            <Box sx={{my: 2}}>
                                                <Divider />
                                            </Box>

                                            <Typography sx={{mb: 2}}> 
                                                <Typography component="span">
                                                    Doctor: <Typography component="span" sx={{fontWeight: 700}}>
                                                        {doctorInDateSelected}
                                                    </Typography>
                                                </Typography>
                                            </Typography>

                                            <Typography sx={{mb: 2}}> 
                                                <Typography component="span">
                                                    Enfermería: <Typography component="span" sx={{fontWeight: 700}}>
                                                        {nurseInDateSelected}
                                                    </Typography>
                                                </Typography>
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </Box>
                            }

                        </CardContent>
                    </Card>
                }

                {loading &&
                    <Card>
                        <CardContent>  
                            <Loader />
                        </CardContent>
                    </Card>
                }
            </Grid>
        </Container>
        </Page>
    );
}
