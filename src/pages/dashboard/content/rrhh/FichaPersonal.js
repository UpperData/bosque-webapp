import {useState} from "react"
import * as Yup from 'yup';
// material
import { CardContent, Hidden, Radio, LinearProgress, Alert , Input, ButtonGroup, RadioGroup, FormControlLabel, InputBase, Box, Stack, Grid, Container, Typography, Card, Button, Modal, TextField, Checkbox, Select, MenuItem, InputLabel, FormControl } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

import { styled, alpha } from '@mui/material/styles';
// import SearchIcon from '@iconify/icons-ant-design/search';
import { useFormik, Form, FormikProvider } from 'formik';
import { LoadingButton, DatePicker, LocalizationProvider  } from '@mui/lab';
import AdapterDateFns from '@mui/lab/AdapterDateFns';

// components
import Page from '../../../../components/Page';
import { useSelector } from "react-redux";

import Cargo from "./Components/Cargo";
import ModalDirection from "./Components/ModalDirection";
import UploaderImg from "./Components/UploaderImg";

import axios from "../../../../auth/fetch"
import Loader from '../../../../components/Loader/Loader';

import { Icon } from '@iconify/react';
import SearchIcon from "@iconify/icons-ic/search"

import { matchRoutes, useLocation } from "react-router-dom"
import { getPermissions } from "../../../../utils/getPermissions";

import { FichaPersonalPrint } from "./pdf/FichaPersonalPrint";
import { PDFDownloadLink, BlobProvider } from "@react-pdf/renderer";
import printJS from 'print-js'

export default function FichaPersonal() {

    const [data, setdata]                   = useState(null);
    const [count, setcount]                 = useState(0);
    const [sending, setsending]             = useState(false);

    const [selectedGender, setselectedGender]               = useState("");
    const [selectedCivilStatus, setSelectedCivilStatus]     = useState("");

    const [progress, setprogress] = useState(0);

    const [selectedStatusAccount, setselectedStatusAccount] = useState(true);

    const civilStatusTypesList  = useSelector(state => state.dashboard.civilStatusTypes.data.data);
    const phoneTypesList        = useSelector(state => state.dashboard.phoneTypesList.data.data);

    const [typePhone, setTypePhone]                         = useState("1");
    const [typeDni, settypeDni]                             = useState("V");

    const [showModalAddCargo,       setshowModalAddCargo]         = useState(false);
    const [showModalAddDirection,   setshowModalAddDirection]     = useState(false);

    const [cargo, setcargo]                                 = useState(null);
    const [direction, setdirection]                         = useState(null);
    const [photo, setphoto]                                 = useState(null);
    const [photoCedula, setphotoCedula]                     = useState(null);

    const [alertSuccessMessage, setalertSuccessMessage] = useState("");
    const [alertErrorMessage,   setalertErrorMessage]   = useState("");

    // SearchData
    const [textSearchData, settextSearchData]   = useState("");
    const [searchingData, setsearchingData]     = useState(false);
    const [dataToEdit, setdataToEdit]           = useState(null);
    const [idToEdit, setidToEdit]               = useState(null);
    const [typeForm, settypeForm]               = useState("create");

    // Permissions
    const location                              = useLocation();
    let MenuPermissionList                      = useSelector(state => state.dashboard.menu);
    let permissions                             = getPermissions(location, MenuPermissionList);

    // console.log("Permissions:", permissions);

    const LoginSchema =     Yup.object().shape({

        gender:             Yup.string().required('Debe seleccionar un género'),
        name:               Yup.string().required('Debe ingresar un nombre'),
        lastname:           Yup.string().required('Debe ingresar su apellido'),

        civilStatus:        Yup.string().required('Debe seleccionar un estado civil'),
        birthday:           Yup.date().required('Debe seleccionar su día de nacimiento'),

        // ------
        email:              Yup.string().required('Debe ingresar su email'),
        phoneNumber:        Yup.string().required('Debe ingresar su teléfono'),
        cedula:             Yup.string().required('Debe ingresar su cédula'),
    });

    const formik = useFormik({
        validateOnChange: false,
        initialValues: {
            accountId       :null,
            gender:         "",

            name:           "",
            lastname:       "",

            civilStatus:    "",
            birthday:       null,
            email:          "",
            phoneNumber:    "",
            cedula:         "",
            observation:    "",

            // modales
            address:        "",
            cargo:          "",

            // No se envian de momento
            experiencia:    [],
            cursos:         [],
            academic:       [],
            contacto:       []
        },
        validationSchema: LoginSchema,
        onSubmit: async (values, {resetForm}) => {
            try {

                const urlSend = "/ADMin/eMPLoyEEFILE/ADd/";
                const urlEdit = "/ADmin/emPLoyeeFiLE/EDiT/";

                // civilStatusTypesList

                let phoneList = [
                    {
                        phoneType:   typePhone,
                        phoneNumber: values.phoneNumber
                    }
                ];

                let getCivilStatus = civilStatusTypesList.find(item => item.id === values.civilStatus);
                // console.log(getCivilStatus);

                let data = {
                    isActive: selectedStatusAccount,

                    fisrtName:      values.name,
                    lastName:       values.lastname,
                    documentId:{
                        nationality: typeDni,
                        number:      values.cedula,
                        birthday:    values.birthday,
                        gender:      values.gender,
                        civilStatus: getCivilStatus
                    },

                    // object
                    address:        direction,
                    cargo,  

                    email:          values.email,

                    accountId:      null,  
                    experiencia:    [],
                    cursos:         [],
                    academic:       [],
                    contacto:       [],

                    phone:          phoneList,

                    photo,
                    digitalDoc:     photoCedula,

                    observation:    values.observation
                }

                console.log(data);
                setsending(true);

                const config = {
                    onUploadProgress: progressEvent => {
                      let progressData = progress;
                      progressData = (progressEvent.loaded / progressEvent.total) * 100;

                      console.log(progressData);

                      setprogress(progressData);
                      setcount(count + progressData);
                    }
                }

                if(typeForm === "create"){

                    axios.post(
                        urlSend,
                        data,
                        config
                    ).then((res) => {

                        console.log(res);
                        setsending(false);

                        if(res.data.result){
                            setalertSuccessMessage(res.data.message);
                            resetForm();

                            setcargo(null);
                            setdirection(null);
                            setphoto(null);
                            setphotoCedula(null);
                            
                            setprogress(0);
                            setcount(0);

                            setsearchingData(false);
                            setidToEdit(null);
                            setdataToEdit(null);
                            settypeForm("create");

                            setTimeout(() => {
                                setalertSuccessMessage("");
                            }, 20000);
                        }

                    }).catch((err) => {
                        let fetchError = err;

                        console.error(fetchError);
                        if(fetchError.response){
                            console.log(err.response);
                            setalertErrorMessage(err.response.data.data.message);
                            setTimeout(() => {
                                setalertErrorMessage("");
                            }, 20000);
                            setsending(false);

                            setsearchingData(false);
                            setidToEdit(null);
                            setdataToEdit(null);
                            settypeForm("create");

                            setprogress(0);
                            setcount(0);
                            // return Promise.reject(err.response.data.data);
                        }
                    });

                }else if(typeForm === "edit"){

                    data.id = dataToEdit.id;

                    
                    axios.put(
                        urlEdit,
                        data,
                        config
                    ).then((res) => {

                        console.log(res);
                        setsending(false);

                        if(res.data.result){
                            setalertSuccessMessage(res.data.message);
                            // resetForm();

                            // setcargo(null);
                            // setdirection(null);
                            // setphoto(null);
                            // setphotoCedula(null);
                            
                            setprogress(0);
                            setcount(0);

                            setTimeout(() => {
                                setalertSuccessMessage("");
                            }, 20000);
                        }

                    }).catch((err) => {
                        let fetchError = err;

                        console.error(fetchError);
                        if(fetchError.response){
                            console.log(err.response);
                            setalertErrorMessage(err.response.data.data.message);
                            setTimeout(() => {
                                setalertErrorMessage("");
                            }, 20000);
                            setsending(false);

                            setprogress(0);
                            setcount(0);
                            // return Promise.reject(err.response.data.data);
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
    // console.log(errors);
    // console.log(permissions);

    // ---------------------------------------- formik ----------------------------------

    const searchPersonalData = async (setFieldValue) => {
        let idSearch = textSearchData;
        const urlSearchData = "/Admin/EMPLoyeeFILE/Get/";

        await setsearchingData(true);
        await setalertSuccessMessage("");
        await setalertErrorMessage("");
        await setdataToEdit(null);

        await resetForm();
        await setcargo(null);
        await setdirection(null);
        await setphoto(null);
        await setphotoCedula(null);

        axios.get(urlSearchData+idSearch)
        .then((res) => {
            if(res.data.result){
                console.log(res.data);
                if(res.data.data !== null){
                    let userData = res.data.data;

                    setdataToEdit(userData);

                    setsearchingData(false);
                    settypeForm("edit");

                    setselectedStatusAccount(userData.isActive);
                    setFieldValue("name",           userData.fisrtName);
                    setFieldValue("lastname",       userData.lastName);
                    setFieldValue("email",          userData.email);

                    setFieldValue("phoneNumber",    userData.phone[0].phoneNumber);
                    setTypePhone(userData.phone[0].phoneType);
                    
                    setFieldValue("gender",           userData.documentId.gender);
                    setFieldValue("birthday",         userData.documentId.birthday);
                    setFieldValue("civilStatus",      userData.documentId.civilStatus.id);

                    // let documentId = JSON.parse(userData.documentId);
                    // console.log(documentId);civilStatus
                    settypeDni(userData.documentId.nationality);
                    setFieldValue("cedula", userData.documentId.number);

                    setphoto(userData.photo);
                    setphotoCedula(userData.digitalDoc);

                    setcargo(userData.cargo);
                    setdirection(userData.address);

                    setidToEdit(idSearch);
                    setFieldValue("observation",    userData.observation);
                    settypeForm("edit");
                    
                    setcount(count * 25);

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

    const addCargo = (data) => {
        setcargo(data);
    }

    const resetAllForm = () => {
        resetForm();
        setcargo(null);
        setdirection(null);
        setphoto(null);
        setphotoCedula(null);

        setsearchingData(false);
        setidToEdit(null);
        setdataToEdit(null);
        settypeForm("create");
        settextSearchData("");
    }

    const printFile = async (blob) => {
        let pdfUrl    = await window.URL.createObjectURL(blob);
        await printJS(pdfUrl);
        window.URL.revokeObjectURL(pdfUrl);
    }

    return (
        <Page title="Ficha de empleado | Cema">
        <Container maxWidth="xl">
            <Box sx={{ pb: 3 }}>
                <Typography variant="h4">
                    Ficha de Empleado
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

                                <Grid container columnSpacing={3}>
                                    <Grid item md={3} xs={6} sx={{mb: 2}}>
                                        <Button 
                                            onClick={() => resetAllForm()} 
                                            variant="outlined" 
                                            fullWidth
                                        >
                                            Nuevo
                                        </Button>
                                    </Grid>
                                    <Grid item md={3} xs={6} sx={{mb: 2}}>
                                        {dataToEdit !== null ?
                                            <BlobProvider 
                                                document={<FichaPersonalPrint data={dataToEdit} />}
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
                                    <Grid item md={3} xs={12} sx={{mb: 2}}>
                                        <Button 
                                            disabled={!permissions.imprime || typeForm === "create"} 
                                            variant="contained" 
                                            color="secondary" 
                                            fullWidth    
                                            className={dataToEdit !== null ? "pdf-download-link" : ""}
                                        >   
                                            {dataToEdit !== null ?
                                                <PDFDownloadLink
                                                    document={<FichaPersonalPrint data={dataToEdit} />}
                                                    fileName="ficha-personal.pdf"
                                                >
                                                    Descargar
                                                </PDFDownloadLink>
                                                :
                                                "Descargar"
                                            }
                                        </Button>
                                    </Grid>
                                    <Grid item md={3} xs={12} sx={{mb: 2}}>
                                        <Grid container columnSpacing={1}>
                                            <Grid item md={9} xs={8}>
                                                <TextField
                                                    label="Buscar"
                                                    size="small"
                                                    value={textSearchData}
                                                    onChange={(e) => settextSearchData(e.target.value)}
                                                    disabled={!permissions.consulta}
                                                />
                                            </Grid>
                                            <Grid item md={3} xs={4}>
                                                <LoadingButton 
                                                    variant="contained" 
                                                    color="primary"
                                                    type="button"
                                                    sx={{ minWidth: "100%", width: "100%"}}
                                                    onClick={() => searchPersonalData(setFieldValue)}
                                                    loading={searchingData}
                                                    disabled={textSearchData === "" || !permissions.consulta}
                                                >
                                                    <i className="mdi mdi-magnify" />
                                                </LoadingButton>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>

                                {!searchingData &&
                                    <div>
                                        <Grid container columnSpacing={3}>
                                            <Grid item md={5} xs={12}>
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

                                                    {civilStatusTypesList.length > 0 &&
                                                        <Stack spacing={3} sx={{my: 2}}>
                                                            <ButtonGroup fullWidth aria-label="outlined button group">
                                                            
                                                                {civilStatusTypesList.map((item, key) => {
                                                                    let datacivilstatusitem = item;
                                                                    return  <Button key={key} onClick={() => setFieldValue("civilStatus", item.id)} variant={values.civilStatus === item.id  ? "contained" : "outlined"} sx={{py: .81}}>
                                                                                {datacivilstatusitem.name}
                                                                            </Button>
                                                                })}
                                                                
                                                            </ButtonGroup>
                                                        </Stack>
                                                    }

                                                    {touched.civilStatus && errors.civilStatus &&
                                                        <Alert sx={{mb: 3}} severity="error">
                                                            {errors.civilStatus}
                                                        </Alert>
                                                    }

                                                    <Stack spacing={3} sx={{my: 2}}>
                                                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                                                            <DatePicker
                                                                label="Fecha Nacimiento"
                                                                value={formik.values.birthday}
                                                                onChange={(value) => {
                                                                    formik.setFieldValue('birthday', value);
                                                                }}
                                                                
                                                                renderInput={
                                                                    (params) => <TextField 
                                                                                fullWidth
                                                                                size='small' 
                                                                                {...getFieldProps('birthday')}
                                                                                helperText={touched.birthday && errors.birthday} 
                                                                                error={Boolean(touched.birthday && errors.birthday)} 
                                                                                {...params} 
                                                                    />
                                                                }
                                                            />
                                                        </LocalizationProvider>
                                                    </Stack>
                                            </Grid>

                                            <Grid item md={4} xs={12}>
                                                <Stack spacing={3} sx={{my: 2}}>
                                                    <TextField
                                                        size='small'
                                                        fullWidth
                                                        autoComplete="email"
                                                        type="email"
                                                        label="Email"
                                                        {...getFieldProps('email')}
                                                        error={Boolean(touched.email && errors.email)}
                                                        helperText={touched.email && errors.email}
                                                    />
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

                                                <UploaderImg 
                                                    file={photoCedula}
                                                    id="uploader-foto-cedula" 
                                                    onChange={(data) => setphotoCedula(data)} 
                                                    maxsize={2}
                                                    accept=".jpg, .jpeg, .png"
                                                    showPreview 
                                                    returnFileType="base64" 
                                                    renderType="Linear" 
                                                    placeholder="Adjuntar cédula"
                                                />

                                                <Stack spacing={3} sx={{my: 2}}>
                                                    <ButtonGroup fullWidth aria-label="outlined button group">
                                                        <Button sx={{py: .81}} onClick={() => setselectedStatusAccount(true)}   variant={selectedStatusAccount ? "contained" : "outlined"}>Activo</Button>
                                                        <Button sx={{py: .81}} onClick={() => setselectedStatusAccount(false)} variant={!selectedStatusAccount ? "contained" : "outlined"}>Inactivo</Button>
                                                    </ButtonGroup>
                                                </Stack>
                                            </Grid>

                                            <Grid item md={3} xs={12}>
                                                <UploaderImg 
                                                    file={photo}
                                                    id="uploader-foto-ficha" 
                                                    onChange={(data) => setphoto(data)} 
                                                    showPreview 
                                                    maxsize={2}
                                                    accept=".jpg, .jpeg, .png"
                                                    returnFileType="base64" 
                                                    renderType="Stack" 
                                                    placeholder="Explorar"
                                                />
                                            </Grid>
                                        </Grid>

                                        <div id="content-list-data-user">
                                            <Grid container columnSpacing={3}>
                                                <Grid md={3} xs={12} item sx={{ mb:2 }}>
                                                    {cargo === null &&
                                                        <Button sx={{py: 1.5}} onClick={() => setshowModalAddCargo(true)} variant="contained" color="secondary" fullWidth>
                                                            Agregar cargo
                                                        </Button>
                                                    }

                                                    {cargo !== null &&
                                                        <Button sx={{py: 1.5}} onClick={() => setcargo(null)} variant="contained" color="primary" fullWidth>
                                                            Eliminar cargo
                                                        </Button>
                                                    }
                                                </Grid>
                                                <Grid md={9} xs={12} item sx={{ mb:2 }}>
                                                    {cargo === null &&
                                                        <div>
                                                            <Alert severity="info">
                                                                No se ha seleccionado un cargo
                                                            </Alert>
                                                        </div>
                                                    }

                                                    {cargo !== null &&
                                                        <div>
                                                            <Grid container columnSpacing={3}> 
                                                                <Grid item md={4} xs={6}>
                                                                    <Typography sx={{ mb:0, fontWeight: "bold" }}>
                                                                        Dirección
                                                                    </Typography>
                                                                    <Typography>
                                                                        {cargo.direccion.name}
                                                                    </Typography>
                                                                </Grid>
                                                                <Grid item md={4} xs={6}>
                                                                    <Typography sx={{ mb:0, fontWeight: "bold" }}>
                                                                        Departamento
                                                                    </Typography>
                                                                    <Typography>
                                                                        {cargo.departamento.name}
                                                                    </Typography>
                                                                </Grid>
                                                                <Grid item md={4} xs={12}>
                                                                    <Typography sx={{ mb:0, fontWeight: "bold" }}>
                                                                        Cargo
                                                                    </Typography>
                                                                    <Typography>
                                                                        {cargo.cargo.name}
                                                                    </Typography>
                                                                </Grid>
                                                            </Grid>
                                                        </div>
                                                    }
                                                </Grid>
                                            </Grid>

                                            <Grid container columnSpacing={3}>
                                                <Grid md={3} xs={12} item sx={{ mb:2 }}>
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
                                                <Grid md={9} xs={12} item sx={{ mb:2 }}>
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
                                                                <Grid item md={2} xs={6}>
                                                                    <Typography sx={{ mb:0, fontWeight: "bold" }}>
                                                                        Estado
                                                                    </Typography>
                                                                    <Typography>
                                                                        {direction.estado.name}
                                                                    </Typography>
                                                                </Grid>
                                                                <Grid item md={3} xs={6}>
                                                                    <Typography sx={{ mb:0, fontWeight: "bold" }}>
                                                                        Municipio
                                                                    </Typography>
                                                                    <Typography>
                                                                        {direction.municipio.name}
                                                                    </Typography>
                                                                </Grid>
                                                                <Grid item md={3} xs={6}>
                                                                    <Typography sx={{ mb:0, fontWeight: "bold" }}>
                                                                        Parroquia
                                                                    </Typography>
                                                                    <Typography>
                                                                        {direction.parroquia.name}
                                                                    </Typography>
                                                                </Grid>
                                                                <Grid item md={3} xs={6}>
                                                                    <Typography sx={{ mb:0, fontWeight: "bold" }}>
                                                                        Dirección
                                                                    </Typography>
                                                                    <Typography>
                                                                        {direction.address}
                                                                    </Typography>
                                                                </Grid>
                                                            </Grid>
                                                        </div>
                                                    }
                                                </Grid>
                                            </Grid>
                                        </div>

                                        <Stack spacing={3} sx={{mt: 3}}>
                                            <TextField
                                                size='small'
                                                fullWidth
                                                autoComplete="observation"
                                                type="text"
                                                label="Observación"
                                                multiline
                                                minRows={4}
                                                maxRows={6}
                                                {...getFieldProps('observation')}
                                                error={Boolean(touched.observation && errors.observation)}
                                                helperText={touched.observation && errors.observation}
                                            />
                                        </Stack>

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

                                {searchingData &&
                                    <Loader />
                                }
                            </CardContent>
                        </Card>
                    </Grid>
                </Form>
            </FormikProvider>

            <Cargo save={(data) => addCargo(data)} show={showModalAddCargo} hide={() => setshowModalAddCargo(false)} />
            <ModalDirection save={(data) => setdirection(data)} show={showModalAddDirection} hide={() => setshowModalAddDirection(false)} />

        </Container>
        </Page>
    );
}
