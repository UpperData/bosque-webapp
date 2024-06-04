import {useState, useEffect} from "react"
import * as Yup from 'yup';
// material
import { CardContent, Hidden, Radio, Alert, ButtonGroup, LinearProgress, FormControlLabel, InputBase, Box, Stack, Grid, Container, Typography, Card, Button, Modal, TextField, Checkbox, Select, MenuItem, InputLabel, FormControl, List, ListItem, ListItemButton, ListItemText } from '@mui/material';

import { useFormik, Form, FormikProvider } from 'formik';
import { LoadingButton, DatePicker, LocalizationProvider, TimePicker  } from '@mui/lab';
import AdapterDateFns from '@mui/lab/AdapterDateFns';

import Scrollbar from "../../../../components/Scrollbar";

import axios from "../../../../auth/fetch"
import Loader from '../../../../components/Loader/Loader';

// components
import Page from '../../../../components/Page';
import ModalDirection from "./ModalDirection";
import { useSelector } from "react-redux";
import { getPermissions } from "../../../../utils/getPermissions";
import { matchRoutes, useLocation } from "react-router-dom"

import { CitaPdf } from "./pdf/Cita";
import { PDFDownloadLink, usePDF, BlobProvider } from "@react-pdf/renderer";
import printJS from 'print-js'

export default function AdministrarCita() {

    const [loading,     setloading]                     = useState(true);
    const [search,      setsearch]                      = useState(true);
    const [data, setdata]                               = useState(null);
    const [count, setcount]                             = useState(0);
    const [examsSelected,       setexamsSelected]       = useState([]);

    const [sending, setsending] = useState(false);
    const [progress, setprogress] = useState(0);
    const [alertSuccessMessage, setalertSuccessMessage] = useState("");
    const [alertErrorMessage,   setalertErrorMessage]   = useState("");

    const phoneTypesList        = useSelector(state => state.dashboard.phoneTypesList.data.data);
    const patientTypesList      = useSelector(state => state.dashboard.patientTypes.data);

    const [typePhone, setTypePhone]                     = useState("1");
    const [typeDni, settypeDni]                         = useState("V");

    const [showModalAddDirection,   setshowModalAddDirection]       = useState(false);
    const [direction, setdirection]                                 = useState(null);

    const [withExams,       setwithExams]               = useState(false);
    const [withMedicine,    setwithMedicine]            = useState(false);

    const [doctors, setdoctors]                         = useState(null);
    const [nurses, setnurses]                           = useState(null);
    
    const [personalTypes, setpersonalTypes]             = useState(null);
    const [appointmentTypes, setappointmentTypes]       = useState(null);

    const [doctorsSelected, setdoctorsSelected]         = useState([]);
    const [nursesSelected, setnursesSelected]           = useState([]);

    const [selectedGender, setselectedGender]           = useState("");

    // SearchData
    const [textSearchData, settextSearchData]   = useState("");
    const [searchingData, setsearchingData]     = useState(false);
    const [dataToEdit, setdataToEdit]           = useState(null);
    const [idToEdit, setidToEdit]               = useState(null);
    const [typeForm, settypeForm]               = useState("create");

    const urlGetPersonal            = "/EMplOyeFIle/BYGRoUP/get/?grp=7&grp=6";
    const urlGetPatientType         = "/pAtieNt/TYPE/geT/*";
    const urlGetAppointmentTypes    = "/APpOINtMENt/typE/*"; 

    const printFile = async (blob) => {
        let pdfUrl    = await window.URL.createObjectURL(blob);
        await printJS(pdfUrl);
        window.URL.revokeObjectURL(pdfUrl);
    }

    // Permissions
    const location                              = useLocation();
    let MenuPermissionList                      = useSelector(state => state.dashboard.menu);
    let permissions                             = getPermissions(location, MenuPermissionList);
    console.log(permissions);

    const LoginSchema =     Yup.object().shape({
        appointmentTypeId:  Yup.string().required('Debe seleccionar el tipo de cita'),
        foreignId:          Yup.string().required('Debe ingresar el id de la cita'),
        siniestroId:        Yup.string().required('Debe ingresar el número siniestro'),

        dateAppointment:    Yup.date().required('Día de la cita').nullable(),
        hourAppointment:    Yup.date().required('Hora de la cita').nullable(),

        direction:          Yup.string().required('Debe ingresar su dirección'),

        gender:             Yup.string().required('Debe seleccionar un género'),
        cedula:             Yup.string().required('Debe ingresar su cédula'),
        name:               Yup.string().required('Debe ingresar un nombre'),
        lastname:           Yup.string().required('Debe ingresar su apellido'),

        birthday:           Yup.date().required('Debe seleccionar su día de nacimiento').nullable(),
        patientTypeId:      Yup.string().required('Debe seleccionar el tipo de paciente'),
        phoneNumber:        Yup.string().required('Debe ingresar su teléfono')
    });

    const formik = useFormik({
        validateOnChange: false,
        initialValues: {
            appointmentTypeId: "1",
            foreignId: "",
            siniestroId: "",
            dateAppointment: null,
            hourAppointment: null,

            direction: "",

            gender: "H",
            cedula: "",
            name: "",
            lastname: "",
            birthday: null,
            patientTypeId: "1",
            phoneNumber: "",
        },
        validationSchema: LoginSchema,
        onSubmit: async (values, {resetForm}) => {
          try {

            let dataAddress     = direction;
            dataAddress.address = values.direction;

            let data = {
                dateAppointment:    values.dateAppointment,
                hourAppointment:    values.hourAppointment,
                
                foreignId:          values.foreignId,
                siniestroId:        values.siniestroId,

                address:            dataAddress,
                isOpened:           true,

                medialPersonal:     {
                    nurses: {employeeId: nursesSelected[0]},
                    doctor: {employeeId: doctorsSelected[0]}
                },

                appointmentTypeId:  values.appointmentTypeId,
                
                birthdate:          values.birthday,
                firstName:          values.name,
                lastName:           values.lastname,
                cedula:             values.cedula,
                nationality:        typeDni,
                gender:             values.gender,
                patientTypeId:      values.patientTypeId,

                phone:              [{ phoneType: typePhone, phoneNumber: values.phoneNumber }]
            }

            console.log(data);

            if(typeForm === "create"){
                const urlCreate = "/APpOINtMeNt/NEW/";

                setsending(true);
                axios.post(urlCreate, data).then((res) => {
                    if(res.data.result){
                        setalertSuccessMessage(res.data.message);
                        setsending(false);
                        resetForm();

                        setTypePhone("1");
                        settypeDni("V");

                        setdoctorsSelected([]);
                        setnursesSelected([]);

                        setdirection(null);

                        settextSearchData("");
                        setsearchingData(false);
                        setdataToEdit(null);
                        setidToEdit(null);
                        settypeForm("create");

                        setTimeout(() => {
                            setalertSuccessMessage("");
                        }, 20000);
                    }
                }).catch((err) => {
                    let fetchError = err;
                    console.error(fetchError);

                    if(fetchError.response){
                        setalertErrorMessage(err.response.data.data.message);
                        setTimeout(() => {
                            setalertErrorMessage("");
                        }, 20000);

                        setsending(false);
                    }
                });
            }else{
                const urlEdit = "/APpOINtMeNt/edit/";
                data.id         = idToEdit;
                data.patientId  = dataToEdit.patientId;

                setsending(true);
                axios.put(urlEdit, data).then((res) => {
                    if(res.data.result){
                        setalertSuccessMessage(res.data.message);
                        setsending(false);

                        setTimeout(() => {
                            setalertSuccessMessage("");
                        }, 20000);
                    }
                }).catch((err) => {
                    let fetchError = err;
                    console.error(fetchError);

                    if(fetchError.response){
                        setalertErrorMessage(err.response.data.data.message);
                        setTimeout(() => {
                            setalertErrorMessage("");
                        }, 20000);

                        setsending(false);
                    }
                });
            }

            // setformErrors("");
            // await login(values.email, values.password);
          } catch(e) {
            // setformErrors(e);
          }
        }
    });

    const { errors, touched, values, isSubmitting, handleSubmit, getFieldProps, setFieldValue, resetForm } = formik;

    const toggleValueToList = async (value, list, setter) => {
        let newList = list;
        // console.log(newList);
        let verify  = newList.find(item => item === value);

        if(verify){
            // delete
            newList = newList.filter(item => item !== value);
            await setter(newList);
        }else{
            // add
            let resetNewList = [];
            resetNewList.push(value);
            newList = resetNewList;
            // newList.push(value);
            await setter(resetNewList);
        }

        await setcount(count + 5);
        console.log(newList);
    }

    const searchDataToEdit = (setFieldValue) => {
        let idSearch = textSearchData;
        const urlSearchData = "/APPOINtMent/get/";

        setsearchingData(true);
        setalertSuccessMessage("");
        setalertErrorMessage("");

        axios.get(urlSearchData+idSearch)
        .then((res) => {
            if(res.data.result){
                console.log(res.data);
                if(res.data.data !== null){
                    let dataToEdit = res.data.data;

                    setdirection(dataToEdit.address);

                    setFieldValue("appointmentTypeId",   dataToEdit.appointmentTypeId);
                    setFieldValue("foreignId",           dataToEdit.foreignId);
                    setFieldValue("siniestroId",         dataToEdit.siniestroId);

                    setFieldValue("dateAppointment",     dataToEdit.dateAppointment);
                    setFieldValue("hourAppointment",     dataToEdit.hourAppointment);

                    setFieldValue("name",                dataToEdit.patient.nombre);
                    setFieldValue("lastname",            dataToEdit.patient.apellido);
                    setFieldValue("birthday",            dataToEdit.patient.edad);
                    setFieldValue("patientTypeId",       dataToEdit.patient.patientTypeId);

                    setFieldValue("gender",              dataToEdit.patient.document.gender);
                    setFieldValue("cedula",              dataToEdit.patient.document.number);

                    setFieldValue("direction",           dataToEdit.address.address);

                    setTypePhone(dataToEdit.patient.phone[0].phoneType);
                    setFieldValue("phoneNumber",         dataToEdit.patient.phone[0].phoneNumber);
                    
                    setidToEdit(idSearch);
                    setdataToEdit(dataToEdit);
                    settypeForm("edit");
                    setsearchingData(false);


                    let newListNurses   = [];
                    let newListDoctors  = [];
                    newListNurses.push(dataToEdit.medialPersonal.nurses.employeeId);
                    newListDoctors.push(dataToEdit.medialPersonal.doctor.employeeId);

                    setnursesSelected(newListNurses);
                    setdoctorsSelected(newListDoctors);

                }else{

                    setalertErrorMessage("No hay coincidencias para la ficha #"+textSearchData);
                    setsearchingData(false);
                    setidToEdit(null);
                    setdataToEdit(null);
                    settypeForm("create");

                    setTimeout(() => {
                        setalertErrorMessage("");
                    }, 15000);

                }
            }
        }).catch((err) => {
        
            let fetchError = err;
            console.error(fetchError);
            if(fetchError.response){
                setsearchingData(false);
                setdataToEdit(null);
                settypeForm("create");
                setalertErrorMessage(err.response.data.data.message);
            }

        });
    }

    const getData = () => {
        // Empleados (medico, enfermera)
        axios.get(urlGetPersonal)
        .then((res) => {
            console.log(res.data);
            let dataList = res.data.data;

            if(dataList.length > 0){

                setdoctors( dataList.find(item => item.roleId === 6).accountRoles);
                setnurses(  dataList.find(item => item.roleId === 7).accountRoles);

                // Tipo de paciente
                axios.get(urlGetPatientType)
                .then((res) => {

                    console.log("-----");

                    if(res.data.result){
                        setpersonalTypes(res.data.data);

                        // Tipo de cita
                        axios.get(urlGetAppointmentTypes)
                        .then((res) => {

                            console.log("-----");

                            if(res.data.result){
                                setappointmentTypes(res.data.data);
                                console.log(res.data);
                                setloading(false);
                            }

                        }).catch((err) => {
                            console.error(err);
                        });
                    }

                }).catch((err) => {
                    console.error(err);
                });

            }

        }).catch((err) => {
            console.error(err);
        });
    }

    useEffect(async () => {
        if(loading){
            if(search){
                getData();
            }
        }
    }, []);


    const changeWithMedicine = (showMedicine) => {
        setwithMedicine(showMedicine);
    }

    const changeWithExams = (showWithExams) => {
        setwithExams(showWithExams);
    }

    // console.log(doctors);

    const reset = () => {
        setsending(false);
        setprogress(0);
        setalertSuccessMessage("");
        setalertErrorMessage("");

        setTypePhone("1");
        settypeDni("V");

        setdoctorsSelected([]);
        setnursesSelected([]);

        setdirection(null);

        settextSearchData("");
        setsearchingData(false);
        setdataToEdit(null);
        setidToEdit(null);
        settypeForm("create");

        resetForm();
    }

    return (
        <Page title="Ficha de empleado | Cema">
        <Container maxWidth="xl">
            <Box sx={{ pb: 3 }}>
                <Typography variant="h4">
                    Gestión de Cita
                </Typography>
            </Box>
            <FormikProvider value={formik}>
                <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
                    <Grid sx={{ pb: 3 }} item xs={12}>
                        <Card>
                            <CardContent>
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
                                
                                <Box>
                                    <Grid container columnSpacing={3}>
                                        <Grid item lg={3} xs={6} sx={{mb: 2}}>
                                            <Button onClick={() => reset()} variant="outlined" fullWidth>
                                                Nuevo
                                            </Button>
                                        </Grid>
                                        <Grid item lg={3} xs={6} sx={{mb: 2}}>
                                            {dataToEdit !== null ?
                                                <BlobProvider 
                                                    document={<CitaPdf data={{...dataToEdit, doctors, nurses}} />}
                                                >
                                                    {({ blob, url, loading, error }) => {
                                                        console.log(blob);
                                                        // Do whatever you need with blob here
                                                        return <Button 
                                                            onClick={() => printFile(blob)} 
                                                            disabled={!permissions.imprime || typeForm === "create"} 
                                                            variant="contained" fullWidth
                                                        >
                                                            Imprimir
                                                        </Button>
                                                    }}
                                                </BlobProvider>
                                            :
                                                <Button 
                                                    disabled={!permissions.imprime || typeForm === "create"} 
                                                    variant="contained" fullWidth
                                                >
                                                    Imprimir
                                                </Button>
                                            }
                                        </Grid>
                                        <Grid item lg={3} xs={12} sx={{mb: 2}}>
                                            <Button 
                                                disabled={!permissions.imprime || typeForm === "create"} 
                                                variant="contained" 
                                                color="secondary" 
                                                fullWidth    
                                                className={dataToEdit !== null ? "pdf-download-link" : ""}
                                            >   
                                                {dataToEdit !== null ?
                                                    <PDFDownloadLink
                                                        document={<CitaPdf data={{...dataToEdit, doctors, nurses}} />}
                                                        fileName="cita.pdf"
                                                    >
                                                        Descargar
                                                    </PDFDownloadLink>
                                                    :
                                                    "Descargar"
                                                }
                                            </Button>
                                        </Grid>
                                        <Grid item lg={3} xs={12} sx={{mb: 2}}>
                                            <Grid container columnSpacing={1}>
                                                <Grid item lg={9} xs={8}>
                                                    <TextField
                                                        label="Buscar"
                                                        size="small"
                                                        value={textSearchData}
                                                        onChange={(e) => settextSearchData(e.target.value)}
                                                        disabled={!permissions.consulta}
                                                    />
                                                </Grid>
                                                <Grid item lg={3} xs={4}>
                                                    <LoadingButton 
                                                        variant="contained" 
                                                        color="primary"
                                                        type="button"
                                                        sx={{ minWidth: "100%", width: "100%"}}
                                                        onClick={() => searchDataToEdit(setFieldValue)}
                                                        loading={searchingData}
                                                        disabled={textSearchData === "" || !permissions.consulta}
                                                    >
                                                        <i className="mdi mdi-magnify" />
                                                    </LoadingButton>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                    

                                    {/* 
                                    <Typography variant="h4" sx={{mb: 3}}>
                                        {typeForm === "create" ? "Generar cita" : "Editar cita"}
                                    </Typography>
                                    */}

                                    {!searchingData && !loading &&
                                        <div>

                                            <Typography variant="h5" sx={{mb: 2}}>
                                                Información de la cita
                                            </Typography>

                                            <div>
                                                <Grid container columnSpacing={3}>
                                                    <Grid item md={3} xs={12} sx={{mb: 2}}>
                                                        {appointmentTypes.length > 0 &&
                                                            <Stack spacing={3}>
                                                                <ButtonGroup fullWidth aria-label="outlined button group">
                                                                
                                                                    {appointmentTypes.map((item, key) => {
                                                                        let appointmentTypesitem = item;
                                                                        return  <Button 
                                                                                    key={key} 
                                                                                    onClick={() => setFieldValue("appointmentTypeId", appointmentTypesitem.id)} 
                                                                                    variant={values.appointmentTypeId.toString() === appointmentTypesitem.id.toString()  ? "contained" : "outlined"} 
                                                                                    sx={{py: .81}}
                                                                                >
                                                                                    {appointmentTypesitem.name}
                                                                                </Button>
                                                                    })}
                                                                    
                                                                </ButtonGroup>
                                                            </Stack>
                                                        }

                                                        {
                                                            /*
                                                            touched.patientTypeId && errors.patientTypeId &&
                                                            <Alert sx={{mb: 3}} severity="error">
                                                                {errors.patientTypeId}
                                                            </Alert>
                                                            */
                                                        }
                                                    </Grid>
                                                    <Grid item md={2} xs={12} sx={{mb: 2}}>
                                                        <TextField
                                                            label="Id"
                                                            size="small"
                                                            fullWidth
                                                            {...getFieldProps('foreignId')}
                                                            error={Boolean(touched.foreignId && errors.foreignId)}
                                                            helperText={touched.foreignId && errors.foreignId}
                                                        />
                                                    </Grid>
                                                    <Grid item md={2} xs={12} sx={{mb: 2}}>
                                                        <TextField
                                                            label="Núm. Siniestro"
                                                            size="small"
                                                            fullWidth
                                                            {...getFieldProps('siniestroId')}
                                                            error={Boolean(touched.siniestroId && errors.siniestroId)}
                                                            helperText={touched.siniestroId && errors.siniestroId}
                                                        />
                                                    </Grid>
                                                    <Grid item md={3} xs={12} sx={{mb: 2}}>
                                                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                                                            <DatePicker
                                                                label="Fecha Cita"
                                                                value={values.dateAppointment}
                                                                onChange={(value) => {
                                                                    formik.setFieldValue('dateAppointment', value);
                                                                }}
                                                                
                                                                renderInput={
                                                                    (params) => <TextField 
                                                                                fullWidth
                                                                                size='small' 
                                                                                {...getFieldProps('dateAppointment')}
                                                                                helperText={touched.dateAppointment && errors.dateAppointment} 
                                                                                error={Boolean(touched.dateAppointment && errors.dateAppointment)} 
                                                                                {...params} 
                                                                    />
                                                                }
                                                            />
                                                        </LocalizationProvider>
                                                    </Grid>
                                                    <Grid item md={2} xs={12} sx={{mb: 2}}>
                                                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                                                            <TimePicker
                                                                label="Hora"
                                                                value={values.hourAppointment}
                                                                onChange={(value) => {
                                                                    formik.setFieldValue('hourAppointment', value);
                                                                }}
                                                                renderInput={(params) => <TextField 
                                                                                        {...params} 
                                                                                        size='small' 
                                                                                        fullWidth
                                                                                        {...getFieldProps('hourAppointment')}
                                                                                        helperText={touched.hourAppointment && errors.hourAppointment} 
                                                                                        error={Boolean(touched.hourAppointment && errors.hourAppointment)} 
                                                                />}
                                                            />
                                                        </LocalizationProvider>
                                                    </Grid>
                                                </Grid>
                                            </div>

                                            <div>
                                                <Grid sx={{ my:3 }} container columnSpacing={3}>
                                                    <Grid sx={{mb: 2}} md={3} xs={12} item>
                                                        {direction === null &&
                                                            <Button sx={{py: 1.5}} onClick={() => setshowModalAddDirection(true)} variant="contained" color="secondary" fullWidth>
                                                                Agregar dirección
                                                            </Button>
                                                        }

                                                        {direction !== null &&
                                                            <Button sx={{py: 1.5}} onClick={() => setdirection(null)} variant="contained" color="primary" fullWidth>
                                                                Eliminar dirección
                                                            </Button>
                                                        }
                                                    </Grid>
                                                    <Grid sx={{mb: 2}} md={9} xs={12} item>
                                                        {direction === null &&
                                                            <div>
                                                                <Alert severity="info">
                                                                    No se ha seleccionado una dirección
                                                                </Alert>
                                                            </div>
                                                        }

                                                        {direction !== null &&
                                                            <div>
                                                                <Grid container columnSpacing={3}> 
                                                                    <Grid item xs={6} md={2}>
                                                                        <Typography sx={{ mb:0, fontWeight: "bold" }}>
                                                                            Estado
                                                                        </Typography>
                                                                        <Typography>
                                                                            {direction.estado.name}
                                                                        </Typography>
                                                                    </Grid>
                                                                    <Grid item xs={6} md={4}>
                                                                        <Typography sx={{ mb:0, fontWeight: "bold" }}>
                                                                            Municipio
                                                                        </Typography>
                                                                        <Typography>
                                                                            {direction.municipio.name}
                                                                        </Typography>
                                                                    </Grid>
                                                                    {direction.ciudad &&
                                                                        <Grid item xs={6} md={3}>
                                                                            <Typography sx={{ mb:0, fontWeight: "bold" }}>
                                                                                Ciudad
                                                                            </Typography>
                                                                            <Typography>
                                                                                {direction.ciudad.name}
                                                                            </Typography>
                                                                        </Grid>
                                                                    }
                                                                    <Grid item xs={6} md={3}>
                                                                        <Typography sx={{ mb:0, fontWeight: "bold" }}>
                                                                            Parroquia
                                                                        </Typography>
                                                                        <Typography>
                                                                            {direction.parroquia.name}
                                                                        </Typography>
                                                                    </Grid>
                                                                </Grid>
                                                            </div>
                                                        }
                                                    </Grid>
                                                </Grid>
                                            </div>

                                            <Stack spacing={3} sx={{my: 3}}>
                                                <TextField
                                                    size='small'
                                                    fullWidth
                                                    autoComplete="address"
                                                    type="text"
                                                    label="Dirección"
                                                    multiline
                                                    minRows={4}
                                                    maxRows={6}
                                                    {...getFieldProps('direction')}
                                                    error={Boolean(touched.direction && errors.direction)}
                                                    helperText={touched.direction && errors.direction}
                                                />
                                            </Stack>

                                            <Typography variant="h5">
                                                Información Paciente
                                            </Typography>

                                            <Grid container columnSpacing={3}>
                                                <Grid item lg={6}>

                                                    <Stack spacing={3} sx={{my: 2}}>
                                                        <ButtonGroup fullWidth aria-label="outlined button group">
                                                            <Button sx={{py: .81}} onClick={() => setFieldValue("gender", "H")} variant={values.gender === "H"  ? "contained" : "outlined"}>Hombre</Button>
                                                            <Button sx={{py: .81}} onClick={() => setFieldValue("gender", "M")} variant={values.gender === "M"  ? "contained" : "outlined"}>Mujer</Button>
                                                        </ButtonGroup>
                                                    </Stack>

                                                    {touched.gender && errors.gender &&
                                                        <Alert sx={{mb: 3}} severity="error">
                                                            {errors.gender}
                                                        </Alert>
                                                    }

                                                    <Stack spacing={3} sx={{my: 2}}>
                                                        <Grid container columnSpacing={1}>
                                                            <Grid item xs={9}>
                                                                <TextField
                                                                    size='small'
                                                                    fullWidth
                                                                    autoComplete="cedula"
                                                                    type="text"
                                                                    label="Cédula"
                                                                    {...getFieldProps('cedula')}
                                                                    error={Boolean(touched.cedula && errors.cedula)}
                                                                    helperText={touched.cedula && errors.cedula}
                                                                />
                                                            </Grid>
                                                            <Grid item xs={3}>
                                                                <Select
                                                                    size="small"
                                                                    fullWidth
                                                                    value={typeDni}
                                                                    onChange={(e) => settypeDni(e.target.value)}
                                                                    displayEmpty
                                                                    inputProps={{ 'aria-label': 'Without label' }}
                                                                >
                                                                    <MenuItem value="V">V</MenuItem>
                                                                    <MenuItem value="E">E</MenuItem>
                                                                </Select>
                                                            </Grid>
                                                        </Grid>
                                                    </Stack>

                                                    <Stack spacing={3} sx={{my: 2}}>
                                                        <TextField
                                                            size='small'
                                                            fullWidth
                                                            autoComplete="name"
                                                            type="text"
                                                            label="Nombres"

                                                            {...getFieldProps('name')}
                                                            error={Boolean(touched.name && errors.name)}
                                                            helperText={touched.name && errors.name}
                                                        />         
                                                    </Stack>

                                                    <Stack spacing={3} sx={{my: 2}}>
                                                        <TextField
                                                            size='small'
                                                            fullWidth
                                                            autoComplete="lastname"
                                                            type="text"
                                                            label="Apellidos"

                                                            {...getFieldProps('lastname')}
                                                            error={Boolean(touched.lastname && errors.lastname)}
                                                            helperText={touched.lastname && errors.lastname}
                                                        />
                                                    </Stack>

                                                </Grid>
                                                <Grid item lg={6}>

                                                    <Stack spacing={3} sx={{my: 2}}>
                                                        {personalTypes.length > 0 &&
                                                            <Stack spacing={3}>
                                                                <ButtonGroup fullWidth aria-label="outlined button group">
                                                                
                                                                    {personalTypes.map((item, key) => {
                                                                        let personalTypesitem = item;
                                                                        return  <Button 
                                                                                    key={key} 
                                                                                    onClick={() => setFieldValue("patientTypeId", personalTypesitem.id)} 
                                                                                    variant={values.patientTypeId.toString() === personalTypesitem.id.toString()  ? "contained" : "outlined"} 
                                                                                    sx={{py: .81}}
                                                                                >
                                                                                    {personalTypesitem.name}
                                                                                </Button>
                                                                    })}
                                                                    
                                                                </ButtonGroup>
                                                            </Stack>
                                                        }

                                                        {touched.patientTypeId && errors.patientTypeId &&
                                                            <Alert sx={{mb: 3}} severity="error">
                                                                {errors.patientTypeId}
                                                            </Alert>
                                                        }
                                                    </Stack>
                                                    
                                                    <Stack spacing={3} sx={{mb: 2}}>
                                                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                                                            <DatePicker
                                                                label="Fecha Nacimiento"
                                                                value={values.birthday}
                                                                onChange={(value) => {
                                                                    formik.setFieldValue('birthday', value);
                                                                }}
                                                                
                                                                renderInput={
                                                                    (params) => <TextField 
                                                                                fullWidth
                                                                                size='small' 
                                                                                {...getFieldProps('birthday')}
                                                                                helperText={touched.birthday && errors.birthday} 
                                                                                error={Boolean(touched.phoneNumber && errors.phoneNumber)} 
                                                                                {...params} 
                                                                    />
                                                                }
                                                            />
                                                        </LocalizationProvider>
                                                    </Stack>

                                                    <Stack spacing={3} sx={{my: 2}}>
                                                        <Grid container columnSpacing={1}>
                                                            <Grid item xs={9}>
                                                                <TextField
                                                                    size='small'
                                                                    fullWidth
                                                                    autoComplete="phoneNumber"
                                                                    type="text"
                                                                    label="Teléfono"
                                                                    {...getFieldProps('phoneNumber')}
                                                                    error={Boolean(touched.phoneNumber && errors.phoneNumber)}
                                                                    helperText={touched.phoneNumber && errors.phoneNumber}
                                                                />
                                                            </Grid>
                                                            <Grid item xs={3}>
                                                                <Select
                                                                    size="small"
                                                                    fullWidth
                                                                    value={typePhone}
                                                                    onChange={(e) => setTypePhone(e.target.value)}
                                                                    displayEmpty
                                                                    inputProps={{ 'aria-label': 'Without label' }}
                                                                >
                                                                    {phoneTypesList.map((item, key) => {
                                                                        let itemPhoneType = item;
                                                                        return  <MenuItem key={key} value={item.id}>
                                                                                    {item.name}
                                                                                </MenuItem>
                                                                    })}
                                                                </Select>
                                                            </Grid>
                                                        </Grid>
                                                    </Stack>
                                                </Grid>
                                            </Grid>

                                            <Typography variant="h5" sx={{mb: 3}}>
                                                Personal Asignado
                                            </Typography>

                                            <Grid container columnSpacing={3}>
                                                <Grid sx={{mb: 2}} item md={6} xs={12}>
                                                    <Card>
                                                        <CardContent>
                                                            <Typography sx={{mb: 3}} align="center" variant="h6">
                                                                Seleccionar Médico
                                                            </Typography>

                                                            <List>
                                                                {doctors.length > 0 &&
                                                                    
                                                                        <Scrollbar
                                                                            sx={{
                                                                                height: "auto",
                                                                                maxHeight: 320,
                                                                                '& .simplebar-content': { maxHeight: 320 ,height: "auto", display: 'flex', flexDirection: 'column' }
                                                                            }}
                                                                        >
                                                                        {doctors.map((doctor, key) => {
                                                                            let item = doctor;
                                                                            if(item.account.employeeFiles.length > 0){
                                                                                return <ListItem 
                                                                                        // sx={{ background: membershipsSelected.includes("Drafts") ? "primary" : "" }} 
                                                                                        disablePadding
                                                                                        key={key}
                                                                                    >
                                                                                        <ListItemButton 
                                                                                            selected={doctorsSelected.includes(item.account.employeeFiles[0].id)} 
                                                                                            onClick={() => toggleValueToList(item.account.employeeFiles[0].id, doctorsSelected, setdoctorsSelected)}
                                                                                        >
                                                                                            <Typography color="primary" component="span" sx={{mr: 2}}>
                                                                                                <i className='mdi mdi-checkbox-blank-circle' />
                                                                                            </Typography>
                                                                                            <ListItemText primary={`${item.account.employeeFiles[0].fisrtName} ${item.account.employeeFiles[0].lastName}`}  />
                                                                                        </ListItemButton>
                                                                                    </ListItem>
                                                                            }

                                                                            return ""
                                                                        })}
                                                                        </Scrollbar>
                                                                    
                                                                }
                                                            </List>
                                                        </CardContent>
                                                    </Card>
                                                </Grid>
                                                <Grid sx={{mb: 2}} item md={6} xs={12}>
                                                    <Card>
                                                        <CardContent>   
                                                            <Typography sx={{mb: 3}} align="center" variant="h6">
                                                                Enfermera
                                                            </Typography>

                                                            <List>
                                                                {nurses.length > 0 &&
                                                                    
                                                                        <Scrollbar
                                                                            sx={{
                                                                                height: "auto",
                                                                                maxHeight: 320,
                                                                                '& .simplebar-content': { maxHeight: 320 ,height: "auto", display: 'flex', flexDirection: 'column' }
                                                                            }}
                                                                        >
                                                                        {nurses.map((nurse, key) => {
                                                                            let item = nurse;
                                                                            if(item.account.employeeFiles.length > 0){
                                                                            return <ListItem 
                                                                                    // sx={{ background: membershipsSelected.includes("Drafts") ? "primary" : "" }} 
                                                                                    disablePadding
                                                                                    key={key}
                                                                                >
                                                                                    <ListItemButton 
                                                                                        selected={nursesSelected.includes(item.account.employeeFiles[0].id)} 
                                                                                        onClick={() => toggleValueToList(item.account.employeeFiles[0].id, nursesSelected, setnursesSelected)}
                                                                                    >
                                                                                        <Typography color="primary" component="span" sx={{mr: 2}}>
                                                                                            <i className='mdi mdi-checkbox-blank-circle' />
                                                                                        </Typography>
                                                                                        <ListItemText primary={`${item.account.employeeFiles[0].fisrtName} ${item.account.employeeFiles[0].lastName}`} />
                                                                                    </ListItemButton>
                                                                                </ListItem>
                                                                            }

                                                                            return ""
                                                                        })}
                                                                        </Scrollbar>
                                                                    
                                                                }
                                                            </List>
                                                        </CardContent>
                                                    </Card>
                                                </Grid>
                                            </Grid>

                                            {progress > 0 &&
                                                <LinearProgress sx={{mt: 3}} color="success" variant="determinate" value={progress} />
                                            }

                                            {typeForm === "create" &&
                                                <LoadingButton
                                                    fullWidth
                                                    size="large"
                                                    type="submit"
                                                    variant="contained"
                                                    loading={sending}
                                                    color="primary"
                                                    sx={{mt: 3}}
                                                    disabled={!permissions.crea}
                                                >
                                                    Guardar
                                                </LoadingButton>
                                            }

                                            {typeForm === "edit" &&
                                                <LoadingButton
                                                    fullWidth
                                                    size="large"
                                                    type="submit"
                                                    variant="contained"
                                                    loading={sending}
                                                    color="secondary"
                                                    sx={{mt: 3}}
                                                    disabled={!permissions.edita}
                                                >
                                                    Editar
                                                </LoadingButton>
                                            }

                                        </div>
                                    }

                                    <ModalDirection withoutDirection save={(data) => setdirection(data)} show={showModalAddDirection} hide={() => setshowModalAddDirection(false)} />
                                </Box>
                                

                                {(loading || searchingData) &&
                                    <Loader />
                                }
                            </CardContent>
                        </Card>
                    </Grid>
                </Form>
            </FormikProvider>
        </Container>
        </Page>
    );

}