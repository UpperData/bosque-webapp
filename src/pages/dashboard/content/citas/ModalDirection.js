import React, {useState, useEffect} from 'react'
import * as Yup from 'yup';
import { styled, alpha } from '@mui/material/styles';
import { Radio, Input, ButtonGroup, RadioGroup, FormControlLabel, InputBase, Box, Stack, Grid, Container, Typography, Card, Button, Modal, TextField, Checkbox, Select, MenuItem, InputLabel, FormControl } from '@mui/material';
import axios from "../../../../auth/fetch"
import { useFormik, Form, FormikProvider } from 'formik';

import AdapterDateFns from '@mui/lab/AdapterDateFns';
import { LoadingButton, DatePicker, LocalizationProvider  } from '@mui/lab';

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

function ModalDirection(props) {

    const [data, setdata]                       = useState([]);
    const [showModalAdd, setshowModalAdd]       = useState(false);

    const [loading,     setloading]             = useState(true);
    const [search,      setsearch]              = useState(true);

    const urlGetEstados                             = "/StaTES/VZLA/gET/*";
    const urlGetCiudades                            = "/citIes/VZlA/STAte/";
    const urlGetMunicipios                          = "/PROvInCES/VzlA/State/";
    const urlGetParroquias                          = "/pARRoQuiaS/vzlA/PROVINCes/";

    const [estados,     setestados]                 = useState([]);
    const [municipios,  setmunicipios]              = useState([]);
    const [ciudades,    setciudades]                = useState([]);
    const [parroquias,  setparroquias]              = useState([]);

    const LoginSchema =     Yup.object().shape({
        estado:             Yup.string().required("Debe seleccionar un  estado"),
        municipio:          Yup.string().required("Debe seleccionar un  municipio"),
        ciudad:             Yup.string().required("Debe seleccionar una ciudad"),
        parroquia:          Yup.string().required("Debe seleccionar una parroquia"),
    });

    const formik = useFormik({
        initialValues: {
            estado:      "",
            municipio:   "",
            ciudad:      "",
            parroquia:   "",
        },
        validationSchema: LoginSchema,
        onSubmit: async (values, {resetForm}) => {
          try {
        
            let estado          = getDataFromList(estados,      'id', Number(values.estado));
            let municipio       = getDataFromList(municipios,   'id', Number(values.municipio));
            let parroquia       = getDataFromList(parroquias,   'id', Number(values.parroquia));
            let ciudad          = getDataFromList(ciudades,     'id', Number(values.ciudad));

            let data = {
                estado,
                municipio,
                parroquia,
                ciudad
            }

            // console.log(data);
            await props.save(data);
            hideModal();

            // setformErrors("");
            // await login(values.email, values.password);

          } catch(e) {
            // setformErrors(e);
          }
        }
    });

    const { errors, resetForm ,touched, values, isSubmitting, handleSubmit, getFieldProps, setFieldValue } = formik;

    const handleCloseModal = () => {
        setshowModalAdd(false);
    }

    const RootStyle = styled(Box)(({ theme }) => ({
        boxShadow: 'none',
        textAlign: 'center',
        padding: theme.spacing(5, 5),
        width: "95%",
        margin: "auto",
        maxWidth: "600px",
        backgroundColor: "#fff",
        userSelect: "none",
        // pointerEvents: "none"
    }));

    const style = {
        width: "95%",
        margin: "auto",
        maxWidth: "600px",
        backgroundColor: "#fff",
        userSelect: "none",
        boxShadow: 'none',
        textAlign: 'center',
    };

    const changeMunicipio = (setFieldValue, value) =>{
        setFieldValue('municipio', value);
        setFieldValue("parroquia", "");
        axios.get(urlGetParroquias+value)
        .then((res) => {

            // console.log("-----");
            // console.log(res.data);
            if(res.data.result){
                let data = res.data.data;
                console.log(res.data.data);
                setparroquias(data);
            }

        }).catch((err) => {
            let error = err.response; 
        });
    }

    const changeState = (setFieldValue, value) =>{

        setFieldValue('estado',     value);
        setFieldValue("municipio",  "");
        setFieldValue("ciudad",     "");
        setFieldValue("parroquia",  "");

        axios.get(urlGetMunicipios+value)
        .then((res) => {

            // console.log("-----");
            // console.log(res.data);
            if(res.data.result){
                let data = res.data.data;
                // console.log(res.data.data);
                setmunicipios(data);

                axios.get(urlGetCiudades+value)
                .then((res) => {

                    // console.log("-----");
                    // console.log(res.data);
                    if(res.data.result){
                        let data = res.data.data;
                        // console.log(res.data.data);
                        setciudades(data);
                    }
                }).catch((err) => {
                    let error = err.response; 
                });

            }

        }).catch((err) => {
            let error = err.response; 
        });
    }

    const getData = async () => {
        setmunicipios([]);
        setparroquias([]);

        axios.get(urlGetEstados)
        .then((res) => {

            // console.log("-----");
            // console.log(res.data);
            if(res.data.result){
                let data = res.data.data;
                // console.log(res.data.data);
                setestados(data);
            }

        }).catch((err) => {
            let error = err.response; 
        });
    }

    useEffect(async () => {
        if(loading){
            if(search){
                await getData();
            }
        }
    }, []);

    const hideModal = () => {
        props.hide();
        resetForm();
        setmunicipios([]);
        setparroquias([]);
    }

    const getDataFromList = (list = [], valType, val) => {
        let getItem = list.find(item => item[valType] === val);
        return getItem;
    }

    // console.log(values);

    return (
        
        <div>
            <Modal
                open={props.show}
                onClose={hideModal}
                onClick={event => event.stopPropagation()}
                onMouseDown={event => event.stopPropagation()}
                keepMounted 
                style={{ 
                    display:'flex', 
                    alignItems:'center', 
                    justifyContent:'center',
                    zIndex: 1300
                }}
            >
                <Box sx={{...style, p: 5, borderRadius: 2}}>
                    <FormikProvider value={formik}>
                        <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
                        
                    
                            <Typography align="center" variant="h4" sx={{fontWeight: "bold", mb:3}}>
                                Agregar dirección
                            </Typography>

                
                            <Grid container columnSpacing={3}>
                                <Grid sx={{my:1}} item md={6} xs={12}>
                                    <FormControl fullWidth size="small">
                                        <InputLabel id="demo-simple-select-autowidth-label">
                                            Estado
                                        </InputLabel>
                                        <Select
                                            fullWidth
                                            labelId="demo-simple-select-autowidth-label"
                                            id="demo-simple-select-autowidth"
                                            defaultValue=""
                                            value={values.estado}
                                            onChange={(e) => changeState(setFieldValue, `${e.target.value}`)}
                                            label="Estado"
                                            MenuProps={MenuProps}

                                            // {...getFieldProps('direccion')}
                                            error={Boolean(touched.estado && errors.estado)}
                                            // helperText={touched.direccion && errors.direccion}
                                        >
                                            {estados.map((item, key) => {
                                                let dataItem = item;
                                                return <MenuItem key={key} value={`${dataItem.id}`}>
                                                            {dataItem.name}
                                                        </MenuItem>
                                            })}
                                        </Select>
                                    </FormControl>
                                </Grid>

                                <Grid sx={{my:1}} item md={6} xs={12}>
                                    <FormControl fullWidth size="small">
                                        <InputLabel id="demo-simple-select-autowidth-label">
                                            Ciudad
                                        </InputLabel>
                                        <Select
                                            fullWidth
                                            labelId="demo-simple-select-autowidth-label"
                                            id="demo-simple-select-autowidth"
                                            defaultValue=""
                                            value={values.ciudad}
                                            onChange={(e) => setFieldValue("ciudad", `${e.target.value}`)}
                                            label="Ciudad"
                                            MenuProps={MenuProps}
                                            disabled={ciudades.length === 0}

                                            // {...getFieldProps('departamento')}
                                            error={Boolean(touched.ciudad && errors.ciudad)}
                                            // helperText={touched.departamento && errors.departamento}
                                        >
                                            {ciudades.map((item, key) => {
                                                let dataItem = item;
                                                return <MenuItem key={key} value={dataItem.id.toString()}>
                                                            {dataItem.name}
                                                        </MenuItem>
                                            })}
                                        </Select>
                                    </FormControl>
                                </Grid>

                                <Grid sx={{my:1}} item md={6} xs={12}>
                                    <FormControl fullWidth size="small">
                                        <InputLabel id="demo-simple-select-autowidth-label">
                                            Municipio
                                        </InputLabel>
                                        <Select
                                            fullWidth
                                            labelId="demo-simple-select-autowidth-label"
                                            id="demo-simple-select-autowidth"
                                            defaultValue=""
                                            value={values.municipio}
                                            onChange={(e) => changeMunicipio(setFieldValue, `${e.target.value}`)}
                                            label="Municipio"
                                            MenuProps={MenuProps}
                                            disabled={municipios.length === 0}

                                            // {...getFieldProps('departamento')}
                                            error={Boolean(touched.municipio && errors.municipio)}
                                            // helperText={touched.departamento && errors.departamento}
                                        >
                                            {municipios.map((item, key) => {
                                                let dataItem = item;
                                                return <MenuItem key={key} value={dataItem.id.toString()}>
                                                            {dataItem.name}
                                                        </MenuItem>
                                            })}
                                        </Select>
                                    </FormControl>
                                </Grid>

                                <Grid sx={{my:1}} item md={6} xs={12}>
                                    <FormControl fullWidth size="small">
                                        <InputLabel id="demo-simple-select-autowidth-label">
                                            Parroquia
                                        </InputLabel>
                                        <Select
                                            fullWidth
                                            labelId="demo-simple-select-autowidth-label"
                                            id="demo-simple-select-autowidth"
                                            defaultValue=""
                                            value={values.parroquia}
                                            onChange={(e) => setFieldValue("parroquia", `${e.target.value}`)}

                                            label="Parroquia"
                                            MenuProps={MenuProps}
                                            disabled={parroquias.length === 0}

                                            // {...getFieldProps('cargo')}
                                            error={Boolean(touched.parroquia && errors.parroquia)}
                                            // helperText={touched.cargo && errors.cargo}
                                        >
                                            {parroquias.map((item, key) => {
                                                let dataItem = item;
                                                return <MenuItem key={key} value={dataItem.id.toString()}>
                                                            {dataItem.name}
                                                        </MenuItem>
                                            })}
                                        </Select>
                                    </FormControl>
                                </Grid>         
                            </Grid>

                            <Box sx={{mt: 3}}>
                                <LoadingButton type="submit" loading={isSubmitting} disabled={(values.address === "" || values.parroquia === "" || parroquias.length === 0 || values.ciuciudades === "" ||ciudades.length === 0)} sx={{px:3, mx:2}} color="primary" variant="contained" size="large">
                                    Agregar
                                </LoadingButton>
                                <Button onClick={() => hideModal()} sx={{px:3, mx:2}} size="large">
                                    Cancelar
                                </Button>
                            </Box>
                        
                        </Form>
                    </FormikProvider>
                </Box>
            </Modal>
        </div>
    )
}

export default ModalDirection