import { useState, useEffect } from "react"
import * as Yup from 'yup';
// material
import { CardContent, Hidden, Radio, Input, Divider, ButtonGroup, RadioGroup, FormControlLabel, InputBase, Box, Stack, Grid, Container, Typography, Card, Button, Modal, TextField, Checkbox, Select, MenuItem, InputLabel, FormControl, List, ListItem, ListItemButton, ListItemText, Alert } from '@mui/material';
import {useLocation } from 'react-router-dom';
import { useFormik, Form, FormikProvider } from 'formik';
import { LoadingButton } from '@mui/lab';
import AdapterDateFns from '@mui/lab/AdapterDateFns';

import Scrollbar from "../../../../components/Scrollbar";

import { Icon } from '@iconify/react';
import CaretRight from "@iconify/icons-ant-design/caret-right"
import CaretLeft from "@iconify/icons-ant-design/caret-left"

import { useSelector } from "react-redux";
import axios from "../../../../auth/fetch"
import Loader from '../../../../components/Loader/Loader';

// components
import Page from '../../../../components/Page';
import { getPermissions } from "../../../../utils/getPermissions";

import { InformePdf } from "./pdf/Informe";
import { PDFDownloadLink, usePDF, BlobProvider } from "@react-pdf/renderer";
import printJS from 'print-js'

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
    style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
    },
    },
};

export default function InformeMedico() {

    const [data, setdata]                               = useState(null);

    const [loading, setloading]                         = useState(true);
    const [search, setsearch]                           = useState(true);
    const [sending, setsending]                         = useState(false);

    const [count, setcount]                             = useState(0);

    const [listDates, setlistDates]                     = useState(null);
    
    const [examsList, setexamsList]                     = useState(null);
    const [medicinesList, setmedicinesList]             = useState(null);

    const [medicinesInList,     setMedicinesInList]     = useState([]);
    const [examsSelected,       setexamsSelected]       = useState([]);

    // SearchData
    const [textSearchData, settextSearchData]           = useState("");
    const [searchingData, setsearchingData]             = useState(false);
    const [dataToEdit, setdataToEdit]                   = useState(null);
    const [idToEdit, setidToEdit]                       = useState(null);
    const [typeForm, settypeForm]                       = useState("create");

    const [alertSuccessMessage, setalertSuccessMessage] = useState("");
    const [alertErrorMessage,   setalertErrorMessage]   = useState("");

    const [doctors, setdoctors]                         = useState(null);
    const [nurses, setnurses]                           = useState(null);

    const idUser = useSelector(state => state.session.userData.data.account.id);

    // principalloading
    const urlGetAppointmentByDoctor                     = "/aPPoINtMent/DOCToR/By";
    const urlGetMedicines                               = `/invENtOrY/aSSGNmEnT/byDoCTOR/${idUser}`;
    const urlGetExams                                   = "/exaMs/geT/*";

    const urlGetPersonal                                = "/EMplOyeFIle/BYGRoUP/get/?grp=7&grp=6";

    const urlGetMedicalReport                           = "/mEdiCAL/get/RePORt/DOCtOR/";

    const urlSaveMedicalReport                          = "/MEDiCAl/aDd/REport/";
    const urlUpdateMedicalReport                        = "/mEdiCaL/EDiT/RepORt/";

    // Permissions
    const location                              = useLocation();
    let MenuPermissionList                      = useSelector(state => state.dashboard.menu);
    let permissions                             = getPermissions(location, MenuPermissionList);

    const LoginSchema =     Yup.object().shape({
        appointmentId:      Yup.string().required('Debe seleccionar una cita'),
        description:        Yup.string().required('Debe ingresar una descripción'),

        withExams:          Yup.boolean(),
        withMedicine:       Yup.boolean(),

        dosage:             Yup.string(),
        otherExams:         Yup.string(),
    });

    const formik = useFormik({
        validateOnChange: false,
        initialValues: {
            appointmentId:  "",
            description:    "",
            withExams:      false,
            withMedicine:   false,
            dosage:         "",
            otherExams:     "",
        },
        validationSchema: LoginSchema,
        onSubmit: async (values, {resetForm}) => {
          try {

            let formattedData = {
                // id: idToEdit,
                appointmentId:  values.appointmentId,
                description:    values.description,

                withExams:      values.withExams,
                withMedicine:   values.withMedicine,

                dosage:         values.dosage,
                otherExams:     values.otherExams,

                medicines:      [],
                exams:          []
            };

            let medicinesInReport = [];

            if(medicinesInList.length > 0){
                let searchMedicines = medicinesInList.filter(item => Number(item.count) > 0);
                medicinesInReport   = [...searchMedicines];
            }
            
            if(values.withExams && examsSelected.length === 0){
                setalertErrorMessage("Debe seleccionar los examenes requeridos.");
            }else if(values.withMedicine && medicinesInReport.length === 0){
                setalertErrorMessage("Debe seleccionar una medicina.");
            }else if(values.withMedicine && values.dosage === ""){
                setalertErrorMessage("Debe ingresar una posología.");
            }else if(typeForm){
                
                setsending(true);

                let newExamsSelectedList = [];
                for (let i = 0; i < examsSelected.length; i++) {
                    const exam = examsList.find(item => Number(item.id) === examsSelected[i]);
                    // console.log(exam);

                    newExamsSelectedList.push(exam);
                }

                let newMedicinesSelectedList = [];
                for (let i = 0; i < medicinesInReport.length; i++) {
                    const medicine = medicinesInReport[i];
                    console.log(medicine);
                    let formattedMedicine       = {};
                    formattedMedicine.id        = medicine.id;
                    formattedMedicine.name      = medicine.article.name;
                    formattedMedicine.cantidad  = medicine.count;

                    newMedicinesSelectedList.push(formattedMedicine);
                }

                formattedData.medicines     = newMedicinesSelectedList;
                formattedData.exams         = newExamsSelectedList;

                setalertErrorMessage("");
                setalertSuccessMessage("");

                console.log(formattedData);

                if(typeForm === "create"){

                    axios({
                        method: "post",
                        url: urlSaveMedicalReport,
                        data: formattedData
                    }).then((res) => {

                        console.log(res.data);
                        if(res.data.result){

                            setalertSuccessMessage(res.data.message);
                            formattedMedicines(medicinesList);
                            setsending(false);
                            resetAppointments();

                            resetForm();

                            setTimeout(() => {
                                setalertSuccessMessage("");
                            }, 20000);
                        }

                    }).catch((err) => {

                        let fetchError = err;
                        console.error(fetchError);
                        if(fetchError.response){
                            console.log(err.response);
                            setalertErrorMessage(err.response.data.message || err.response.data.data.message);
                            setsending(false);
                            // return Promise.reject(err.response.data.data);
                        }
                    });

                }else if(typeForm === "edit"){

                    formattedData.id = idToEdit;

                    axios({
                        method: "put",
                        url: urlUpdateMedicalReport,
                        data: formattedData
                    }).then((res) => {

                        console.log(res.data);
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
                            console.log(err.response);
                            setalertErrorMessage(err.response.data.message || err.response.data.data.message);
                            setsending(false);
                            // return Promise.reject(err.response.data.data);
                        }
                    });

                }
                
            }
                
            // setformErrors("");
            // await login(values.email, values.password);

          } catch(e) {

            // setformErrors(e);

          }
        }
    });

    const { errors, touched, values, isSubmitting, handleSubmit, getFieldProps, setFieldValue, resetForm } = formik;

    const formattedMedicines = (medicines) => {
        if(medicines !== null && medicines.length > 0){
            let newMedicinesList = [];

            for (let i = 0; i < medicines.length; i++) {
                const medicine = medicines[i];
                let newMedicineItem   = {...medicine};
                newMedicineItem.count = 0;
                newMedicinesList.push(newMedicineItem);
            }

            setMedicinesInList(newMedicinesList);
            setloading(false);
        }else{
            setMedicinesInList([]);
            setloading(false);
        }
    }

    const resetAppointments = () => {
        axios.get(urlGetAppointmentByDoctor)
        .then((res) => {
            let data        = res.data;
            if(data.result){
                setlistDates(res.data.data);
            }else{
                setalertErrorMessage(res.data.data.message);
                setlistDates([]);
            }
        }).catch((err) => {
            setlistDates([]);
        });
    }

    useEffect(async () => {
        if(loading){
            if(search){
                getData();
            }
        }
    }, []);

    const reset = () => {
        setdataToEdit(null);
        setidToEdit(null);

        settypeForm("create");
 
        settextSearchData("");
        setsearchingData(false);

        formattedMedicines(medicinesList);

        setalertErrorMessage("");
        setalertErrorMessage("");
        setsending(false);

        resetForm();
    }

    const printFile = async (blob) => {
        let pdfUrl    = await window.URL.createObjectURL(blob);
        await printJS(pdfUrl);
        window.URL.revokeObjectURL(pdfUrl);
    }

    // get all data
    const getData = () => {

        // appointments

        axios.get(urlGetAppointmentByDoctor)
        .then((res) => {
            let data        = res.data;

            if(data.result){
                setlistDates(res.data.data);
            
                axios.get(urlGetPersonal)
                .then((res) => {
                    let dataList = res.data.data;
                    if(dataList.length > 0){

                        setdoctors(dataList[0].accountRoles);
                        setnurses(dataList[1].accountRoles);

                        if(data.result){

                            setlistDates(data.data);
            
                            // exams
            
                            axios.get(urlGetExams)
                            .then((res) => {
                                let data        = res.data;
                                let dataList    = res.data.data;
            
                                // console.log(res.data);
            
                                if(data.result){
                                    setexamsList(res.data.data);
            
                                    // medicines
            
                                    axios.get(urlGetMedicines)
                                    .then((res) => {
                                        let data        = res.data;
                                        let dataList    = res.data.data;
            
                                        // console.log(res.data);
            
                                        if(data.result){
                                            setmedicinesList(res.data.data);
                                            formattedMedicines(res.data.data);
            
                                            setsearch(false);
                                        }
            
                                    }).catch((err) => {
                                        console.error(err);
                                    });
            
                                }
            
                            }).catch((err) => {
                                console.error(err);
                            });
                        }
                    }
                }).catch((err) => {
                    console.error(err);
                });
            }else{
                setalertErrorMessage(res.data.data.message);
                setlistDates([]);
            }

        }).catch((err) => {
            let fetchError = err;
            console.error(fetchError);
            if(fetchError.response){
                console.log(err.response);
                setalertErrorMessage(err.response.data.message || err.response.data.data.message);
                setlistDates([]);
                setsending(false);
                setloading(false);
                // return Promise.reject(err.response.data.data);
            }
        });
    }

    const searchDataToEdit = () => {
        setsearchingData(true);

        axios.get(urlGetMedicalReport+textSearchData).then((res) => {
            if(res.data.result){
                console.log("Edit", res.data);
                if(res.data.data !== null){
                    let datasearch = res.data.data;

                    setdataToEdit(res.data.data);
                    setidToEdit(datasearch.id);
    
                    setFieldValue("appointmentId",   datasearch.appointmentId);
    
                    setFieldValue("withExams",      datasearch.withExams);
                    setFieldValue("withMedicine",   datasearch.withMedicine);
    
                    setFieldValue("dosage",         datasearch.dosage ? datasearch.dosage : "");
                    setFieldValue("otherExams",     datasearch.otherExams ? datasearch.otherExams : "");
    
                    setFieldValue("description",    datasearch.description ? datasearch.description : "");
    
                    let examList = [];
                    if(datasearch.exams !== null && datasearch.exams.length > 0){
                        for (let i = 0; i < datasearch.exams.length; i++) {
                            const exam = datasearch.exams[i];
                            examList.push(exam.id);
                        }
                    }
                    setexamsSelected(examList);
    
                    let medicinesList = [...medicinesInList];
                    if(datasearch.medicines !== null && datasearch.medicines.length > 0){
                        for (let i = 0; i < datasearch.medicines.length; i++) {
                            const medicine              = datasearch.medicines[i];
    
                            let searchMedicine          = medicinesList.find(item => item.id === medicine.id);
                            let index                   = medicinesList.indexOf(searchMedicine);
    
                            searchMedicine              = {...searchMedicine};
                            if(medicine.hasOwnProperty("cantidad")){
                                searchMedicine.count    = medicine.cantidad;
                            }else{
                                searchMedicine.count    = 0;
                            }
                           
                            medicinesList[index]    = searchMedicine;
                        }
                    }
    
                    setMedicinesInList(medicinesList);
                    setsearchingData(false);
                    settypeForm("edit");
                }else{
                    setsearchingData(false);
                    setalertErrorMessage("Busqueda insatisfactoria");

                    setTimeout(() => {
                        setalertErrorMessage("");
                    }, 6000);
                }
            }

        }).catch((err) => {

            let fetchError = err;
            console.error(fetchError);
            if(fetchError.response){
                console.log(err.response);
                setalertErrorMessage(err.response.data.message || err.response.data.data.message);
                setsending(false);
                // return Promise.reject(err.response.data.data);
            }

        });
    }

    // toggle values

    const changeWithMedicine = (showMedicine) => {
        setFieldValue("withMedicine", showMedicine);
    }

    const changeWithExams = (showWithExams) => {
        setFieldValue("withExams", showWithExams);
    }

    const toggleValueToExams = async (value) => {
        let newList = examsSelected;
        // console.log(newList);
        let verify  = newList.find(item => item === value);

        if(verify){
            // delete
            newList = newList.filter(item => item !== value);
            await setexamsSelected(newList);
        }else{
            // add
            newList.push(value);
            await setexamsSelected(newList);
        }

        await setcount(count + 5);
        console.log(newList);
    }

    const handleMedicineCountCHange = (id, newCount) => {
        let list    = [...medicinesInList];
        let getItem = list.find(item => item.id === id);
        let index   = list.indexOf(getItem);

        getItem.count = newCount;

        list[index] = getItem;
        setMedicinesInList(list);
    }

    return (
        <Page title="Ficha de empleado | Cema">
        <Container maxWidth="xl">
            <Box sx={{ pb: 3 }}>
                <Typography variant="h4">
                    Informe Médico
                </Typography>
            </Box>
            <FormikProvider value={formik}>
                <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
                    <Grid sx={{ pb: 3 }} item xs={12}>
                        <Card>
                            <CardContent>
                                {(loading || searchingData) &&
                                    <Loader />
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

                                {!loading && !searchingData &&
                                    <div>

                                        <Grid sx={{mb: 3}} container columnSpacing={3}>
                                            <Grid item md={3} xs={6} sx={{ mb:2}}>
                                                <Button onClick={() => reset()} variant="contained" fullWidth>
                                                    Nuevo
                                                </Button>
                                            </Grid>
                                            <Grid item md={3} xs={6} sx={{ mb:2}}>
                                                {dataToEdit !== null ?
                                                    <BlobProvider 
                                                        document={<InformePdf data={{...dataToEdit, doctors, nurses}} />}
                                                    >
                                                        {({ blob, url, loading, error }) => {
                                                            console.log(blob);
                                                            // Do whatever you need with blob here
                                                            return <Button 
                                                                onClick={() => printFile(blob)} 
                                                                disabled={!permissions.imprime || typeForm === "create"} 
                                                                variant="contained" 
                                                                fullWidth
                                                                color="secondary"
                                                            >
                                                                Imprimir
                                                            </Button>
                                                        }}
                                                    </BlobProvider>
                                                :
                                                    <Button 
                                                        disabled={!permissions.imprime || typeForm === "create"} 
                                                        variant="contained" 
                                                        fullWidth
                                                        color="secondary"
                                                    >
                                                        Imprimir
                                                    </Button>
                                                }

                                            </Grid>
                                            <Grid item md={3} xs={12} sx={{ mb:2}}>
                                                <Button 
                                                    disabled={
                                                        // !permissions.imprime || 
                                                        typeForm === "create"
                                                    } 
                                                    variant="contained" 
                                                    color="secondary" 
                                                    fullWidth    
                                                    className={dataToEdit !== null ? "pdf-download-link" : ""}
                                                >   
                                                    {dataToEdit !== null ?
                                                        <PDFDownloadLink
                                                            document={<InformePdf data={{...dataToEdit, doctors, nurses}} />}
                                                            fileName="cita.pdf"
                                                        >
                                                            Descargar
                                                        </PDFDownloadLink>
                                                        :
                                                        "Descargar"
                                                    }
                                                </Button>
                                            </Grid>
                                            <Grid item md={3} xs={12}>
                                                <Grid container columnSpacing={1}>
                                                    <Grid item lg={9} xs={8}>
                                                        <TextField
                                                            label="Buscar"
                                                            size="small"
                                                            value={textSearchData}
                                                            disabled={searchingData}
                                                            onChange={(e) => settextSearchData(e.target.value)}
                                                        />
                                                    </Grid>
                                                    <Grid item lg={3} xs={4}>
                                                        <LoadingButton 
                                                            variant="contained" 
                                                            color="primary"
                                                            type="button"
                                                            sx={{ minWidth: "100%", width: "100%", py: 1}}
                                                            onClick={() => searchDataToEdit()}
                                                            loading={searchingData}
                                                            disabled={textSearchData === ""}
                                                        >
                                                            <i className="mdi mdi-magnify" />
                                                        </LoadingButton>
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                        </Grid>

                                        {(listDates.length > 0) || dataToEdit !== null  ?
                                            <div>
                                                {!searchingData 
                                                ?
                                                    <Grid container columnSpacing={3}>
                                                        <Grid item lg={12}>
                                                            
                                                            <Box sx={{ pb: 1 }}>
                                                                <Typography variant="h6">
                                                                    Información General
                                                                </Typography>

                                                                {dataToEdit === null &&
                                                                    <Grid container columnSpacing={3} sx={{mt: 2, mb: 1}}>
                                                                        <Grid item xs={12}>
                                                                            <FormControl fullWidth size="small">
                                                                                <InputLabel id="demo-simple-select-date">
                                                                                    ID Cita - Nombre Apellido
                                                                                </InputLabel>
                                                                                <Select
                                                                                    fullWidth
                                                                                    labelId="demo-simple-select-date"
                                                                                    id="demo-simple-select-date"

                                                                                    value={values.appointmentId}
                                                                                    onChange={(e) => setFieldValue('appointmentId', `${e.target.value}`)}
                                                                                    
                                                                                    label="ID Cita - Nombre Apellido"
                                                                                    MenuProps={MenuProps}

                                                                                    {...getFieldProps('appointmentId')}
                                                                                    error={Boolean(touched.appointmentId && errors.appointmentId)}
                                                                                    // helperText={touched.appointmentId && errors.appointmentId}
                                                                                >

                                                                                    {listDates !== null && listDates.map((item, key) => {
                                                                                        let dataItem = item;
                                                                                        return <MenuItem key={key} value={`${dataItem.appointments[0].appointmentId}`}>
                                                                                                {dataItem.appointments[0].appointmentId} - {`${dataItem.nombre} ${dataItem.apellido} (${dataItem.document.nationality.toLowerCase()+"-"+dataItem.document.number})`}
                                                                                                </MenuItem>
                                                                                    })}

                                                                                </Select>
                                                                            </FormControl>
                                                                            {Boolean(touched.appointmentId && errors.appointmentId) &&
                                                                                <Typography sx={{fontSize: 12, mt: .8}} color="primary">
                                                                                    {errors.appointmentId}
                                                                                </Typography>
                                                                            }
                                                                        </Grid>
                                                                    </Grid>
                                                                }
                                                            </Box>

                                                            {values.appointmentId !== "" &&
                                                                <div>

                                                                    <Stack spacing={3} sx={{mt: 2}}>
                                                                        <TextField
                                                                            size='small'
                                                                            fullWidth
                                                                            autoComplete="description"
                                                                            type="number"
                                                                            label="Descripción"
                                                                            multiline
                                                                            rows={5}
                                                                            // maxRows={10}

                                                                            {...getFieldProps('description')}
                                                                            error={Boolean(touched.description && errors.description)}
                                                                            helperText={touched.description && errors.description}
                                                                        />
                                                                    </Stack>

                                                                    <Grid sx={{mt:4}} container columnSpacing={3}>
                                                                        <Grid item xs={6}>

                                                                            <Typography sx={{mb: 1}} align="center" variant="h6">
                                                                                ¿Se aplicaron medicamentos? 
                                                                            </Typography>
                                                                            <ButtonGroup sx={{mb: 3}} fullWidth aria-label="outlined button group">
                                                                                <Button disabled={medicinesInList.length <= 0} size="small" onClick={() => changeWithMedicine(true)} sx={{py: .81}} variant={values.withMedicine  ? "contained" : "outlined"} color="secondary">Si</Button>
                                                                                <Button size="small" onClick={() => changeWithMedicine(false)} sx={{py: .81}} variant={!values.withMedicine ? "contained" : "outlined"} color="secondary">No</Button>
                                                                            </ButtonGroup>

                                                                            {values.withMedicine 
                                                                                ?
                                                                                <Card sx={{py: 3, px: 3}}>
                                                                                    <Typography align="center" sx={{mb: 1, mt:2}} variant="h5">
                                                                                        Medicamentos Aplicados
                                                                                    </Typography>
                                                                                    {medicinesInList.length > 0
                                                                                    ?
                                                                                        <List>
                                                                                            <Scrollbar
                                                                                                sx={{
                                                                                                    height: "auto",
                                                                                                    '& .simplebar-content': { maxHeight: 200 ,height: "auto", display: 'flex', flexDirection: 'column' }
                                                                                                }}
                                                                                            >
                                                                                                {medicinesInList.map((medicine, key) => {
                                                                                                    let item = medicine;
                                                                                                    return <ListItem 
                                                                                                            key={key}
                                                                                                                // sx={{ background: membershipsSelected.includes("Drafts") ? "primary" : "" }} 
                                                                                                                disablePadding
                                                                                                            >
                                                                                                            <Grid container alignItems="center">
                                                                                                                <Grid item xs={7}>
                                                                                                                    <Typography sx={{fontWeight: "bold"}}>
                                                                                                                        {item.article.name}
                                                                                                                    </Typography>
                                                                                                                </Grid>
                                                                                                                <Grid item xs={5}>
                                                                                                                    <Grid container alignItems="center">
                                                                                                                        <Grid item xs={4} sx={{px: .5}}>
                                                                                                                            <Button 
                                                                                                                                type="button" 
                                                                                                                                size="small" 
                                                                                                                                sx={{py: 1.5, px: 0, minWidth: 0, width: "100%"}}
                                                                                                                                color="secondary" 
                                                                                                                                variant="contained"
                                                                                                                                disabled={sending || item.count === 0}
                                                                                                                                onClick={() => handleMedicineCountCHange(item.id, item.count - 1)}
                                                                                                                            >
                                                                                                                                <Icon icon={CaretLeft} />
                                                                                                                            </Button>
                                                                                                                        </Grid>
                                                                                                                        <Grid item xs={4}>
                                                                                                                            <TextField
                                                                                                                                hiddenLabel
                                                                                                                                size='small'
                                                                                                                                fullWidth
                                                                                                                                autoComplete="lastname"
                                                                                                                                type="number"
                                                                                                                                label=""
                                                                                                                                InputProps={{
                                                                                                                                    readOnly: true,
                                                                                                                                }}
                                                                                                                                value={item.count}
                                                                                                                            />
                                                                                                                        </Grid>
                                                                                                                        <Grid item xs={4} sx={{px: .5}}>
                                                                                                                            <Button 
                                                                                                                                type="button" 
                                                                                                                                size="small" 
                                                                                                                                sx={{py: 1.5, px: 0, minWidth: 0, width: "100%"}} 
                                                                                                                                color="secondary" 
                                                                                                                                variant="contained"
                                                                                                                                disabled={sending || item.count >= item.quantity}
                                                                                                                                onClick={() => handleMedicineCountCHange(item.id, item.count + 1)}
                                                                                                                            >
                                                                                                                                <Icon icon={CaretRight} />
                                                                                                                            </Button>
                                                                                                                        </Grid>
                                                                                                                    </Grid>
                                                                                                                </Grid>
                                                                                                            </Grid>
                                                                                                            <Divider />
                                                                                                        </ListItem>
                                                                                                })}
                                                                                            </Scrollbar>
                                                                                        </List>
                                                                                    :
                                                                                        <Alert severity="info"> 
                                                                                            Sin medicamentos
                                                                                        </Alert>
                                                                                    }
                                                                                </Card>
                                                                                :
                                                                                <Card sx={{py: 3, px: 3}}>
                                                                                    <Alert severity="info"> 
                                                                                        No se requirió de medicamentos adicionales.
                                                                                    </Alert>
                                                                                </Card>
                                                                            }

                                                                        </Grid>
                                                                        <Grid item xs={6}>

                                                                            <Typography sx={{mb: 1}} align="center" variant="h6">
                                                                                ¿Requiere exámenes médicos? 
                                                                            </Typography>
                                                                            <ButtonGroup sx={{mb: 3}} fullWidth aria-label="outlined button group">
                                                                                <Button size="small" onClick={() => changeWithExams(true)}  sx={{py: .81}} variant={values.withExams  ? "contained" : "outlined"} color="secondary">Si</Button>
                                                                                <Button size="small" onClick={() => changeWithExams(false)} sx={{py: .81}} variant={!values.withExams ? "contained" : "outlined"} color="secondary">No</Button>
                                                                            </ButtonGroup>

                                                                            {values.withExams 
                                                                                ?
                                                                                <Card sx={{py: 3, px: 3}}>
                                                                                    <Typography align="center" sx={{ mb: 1, mt:2 }} variant="h5">
                                                                                        Exámenes Aplicados
                                                                                    </Typography>
                                                                                    <List>
                                                                                        <Scrollbar
                                                                                            sx={{
                                                                                                height: 200,
                                                                                                '& .simplebar-content': { maxHeight: 200 ,height: 200, display: 'flex', flexDirection: 'column' }
                                                                                            }}
                                                                                        >
                                                                                            {examsList.map((exam, key) => {
                                                                                                let item = exam;
                                                                                                    return <ListItem 
                                                                                                        key={key}
                                                                                                        // sx={{ background: membershipsSelected.includes("Drafts") ? "primary" : "" }} 
                                                                                                        disablePadding
                                                                                                    >
                                                                                                        <ListItemButton 
                                                                                                            selected={examsSelected.includes(item.id)} 
                                                                                                            onClick={() => toggleValueToExams(item.id)}
                                                                                                        >
                                                                                                            <ListItemText primary={item.name} />
                                                                                                        </ListItemButton>
                                                                                                    </ListItem>
                                                                                            })}
                                                                                        </Scrollbar>
                                                                                    </List>
                                                                                </Card>
                                                                                :
                                                                                <Card sx={{py: 3, px: 3}}>
                                                                                    <Alert severity="info"> 
                                                                                        Sin examenes requeridos.
                                                                                    </Alert>
                                                                                </Card>
                                                                            }

                                                                        </Grid>
                                                                    </Grid>

                                                                    { values.withMedicine &&
                                                                        <div>

                                                                            <Typography sx={{mt: 4}} variant="h6">
                                                                                Posología
                                                                            </Typography>
                                                                            <Stack spacing={3} sx={{my: 1}}>
                                                                                <TextField

                                                                                    size='small'
                                                                                    fullWidth
                                                                                    autoComplete="otherExams"
                                                                                    type="text"
                                                                                    label="Otros"
                                                                                    multiline
                                                                                    rows={4}
                                                                                    // maxRows={4}

                                                                                    {...getFieldProps('dosage')}
                                                                                    error={Boolean(touched.dosage && errors.dosage)}
                                                                                    helperText={touched.dosage && errors.dosage}
                                                                                />
                                                                            </Stack>

                                                                        </div>
                                                                    }

                                                                    { values.withExams &&
                                                                        <div>

                                                                            <Typography sx={{mt: 4}} variant="h6">
                                                                                Otros examenes
                                                                            </Typography>
                                                                            <Stack spacing={3} sx={{my: 1}}>
                                                                                <TextField

                                                                                    size='small'
                                                                                    fullWidth
                                                                                    autoComplete="otherExams"
                                                                                    type="text"
                                                                                    label="Otros"
                                                                                    multiline
                                                                                    rows={2}
                                                                                    // maxRows={4}

                                                                                    {...getFieldProps('otherExams')}
                                                                                    error={Boolean(touched.otherExams && errors.otherExams)}
                                                                                    helperText={touched.otherExams && errors.otherExams}
                                                                                />
                                                                            </Stack>

                                                                        </div>
                                                                    }

                                                                </div>
                                                            }

                                                        </Grid>
                                                    </Grid>
                                                :
                                                    <Loader />
                                                }
                                                

                                                {typeForm === "create" && values.appointmentId !== "" && !searchingData &&
                                                    <LoadingButton
                                                        fullWidth
                                                        size="large"
                                                        type="submit"
                                                        variant="contained"
                                                        loading={sending}
                                                        color="primary"
                                                        sx={{mt: 3}}
                                                    >
                                                        Guardar
                                                    </LoadingButton>
                                                }

                                                {typeForm === "edit" && values.appointmentId !== "" && !searchingData &&
                                                    <LoadingButton
                                                        fullWidth
                                                        size="large"
                                                        type="submit"
                                                        variant="contained"
                                                        loading={sending}
                                                        color="secondary"
                                                        sx={{mt: 3}}
                                                    >
                                                        Editar
                                                    </LoadingButton>
                                                }
                                            </div>  
                                            :
                                            <Alert severity="info">
                                                No se han encontrado citas agendadas.
                                            </Alert>
                                        }
                                    </div>
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
