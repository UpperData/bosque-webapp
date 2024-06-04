import React, {useState, useEffect} from 'react'
import * as Yup from 'yup';
import { styled, alpha } from '@mui/material/styles';
import { Radio, Input, ButtonGroup, RadioGroup, FormControlLabel, InputBase, Box, Stack, Grid, Container, Typography, Card, Button, Modal, TextField, Checkbox, Select, MenuItem, InputLabel, FormControl } from '@mui/material';
import axios from "../../../../../auth/fetch"
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

const style = {
    width: "95%",
    margin: "auto",
    maxWidth: "600px",
    backgroundColor: "#fff",
    userSelect: "none",
    boxShadow: 'none',
    textAlign: 'center',
};

function Cargo(props) {

    const [data, setdata]                       = useState([]);
    const [showModalAdd, setshowModalAdd]       = useState(false);

    const [loading,     setloading]             = useState(true);
    const [search,      setsearch]              = useState(true);

    const urlGetDepartment                      = "/departament/get/*";
    const urlGetSubDepartment                   = "/sUBDepartament/get/";
    const urlGetCargo                           = "/CargO/GEt/";

    const [departmentList, setdepartmentList]       = useState([]);
    const [subDepartmentList, setsubDepartmentList] = useState([]);
    const [cargoList, setcargoList]                 = useState([]);

    const handleCloseModal = () => {
        setshowModalAdd(false);
    }

    const RootStyle = styled(Card)(({ theme }) => ({
        boxShadow: 'none',
        textAlign: 'center',
        padding: theme.spacing(5, 5),
        width: "95%",
        margin: "auto",
        maxWidth: "600px",
        backgroundColor: "#fff",
    }));

    const changeDirection = (setFieldValue, value) => {
        setFieldValue('direccion', value);
        setFieldValue('departamento',    "");
        setFieldValue('cargo',        "");

        setcargoList([]);
        axios.get(urlGetSubDepartment+value)
        .then((res) => {

            // console.log("-----");
            // console.log(res.data);
            if(res.data.result){
                let data = res.data.data;
                // console.log(res.data.data);
                setsubDepartmentList(data);
            }

        }).catch((err) => {
            let error = err.response; 
        });
    }

    const LoginSchema =     Yup.object().shape({
        direccion:          Yup.string().required("Debe seleccionar una direccion"),
        departamento:       Yup.string().required("Debe seleccionar un departamento"),
        cargo:              Yup.string().required("Debe seleccionar un cargo")
    });

    const formik = useFormik({
        initialValues: {
            direccion:      "",
            departamento:   "",
            cargo:          ""
        },
        validationSchema: LoginSchema,
        onSubmit: async (values, {resetForm}) => {
          try {
            // console.log(values);
            
            let direccion = getDataFromList(departmentList, 'id', Number(values.direccion));
            let departamento = getDataFromList(subDepartmentList, 'id', Number(values.departamento));
            let cargo = getDataFromList(cargoList, 'id', Number(values.cargo));

            let data = {
                direccion,
                departamento,
                cargo
            }

            // console.log("Add cargo:", data);
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


    const changeSubDepartment = (setFieldValue, value) => {
        setFieldValue('departamento', value);
        setFieldValue('cargo',        "");
        
        axios.get(urlGetCargo+values.direccion)
        .then((res) => {

            // console.log("-----");
            // console.log(res.data);
            if(res.data.result){
                let data = res.data.data;
                // console.log(res.data.data);
                setcargoList(data);
            }

        }).catch((err) => {
            let error = err.response; 
        });
    }

    const getData = async () => {
        setsubDepartmentList([]);
        setcargoList([]);

        axios.get(urlGetDepartment)
        .then((res) => {

            // console.log("-----");
            // console.log(res.data);
            if(res.data.result){
                let data = res.data.data;
                // console.log(res.data.data);
                setdepartmentList(data);
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
        setsubDepartmentList([]);
        setcargoList([]);
    }

    const getDataFromList = (list = [], valType, val) => {
        let getItem = list.find(item => item[valType] === val);
        return getItem;
    }

    return (
        <div>
            <Modal
                open={props.show}
                onClose={hideModal}
                aria-labelledby="modal-modal-change-role-title"
                aria-describedby="modal-modal-change-role-description"
                style={{ display:'flex', alignItems:'center', justifyContent:'center' }}
            >
                <Box sx={{...style, p: 5, borderRadius: 2}}>
                    <Typography align="center" variant="h4" sx={{fontWeight: "bold", mb:3}}>
                        Agregar cargo del personal
                    </Typography>

                    <FormikProvider value={formik}>
                        <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
                            <Grid container columnSpacing={3}>
                                <Grid sx={{my:1}} item md={6} xs={12}>
                                    <FormControl fullWidth size="small">
                                        <InputLabel id="demo-simple-select-autowidth-label">
                                            Dirección
                                        </InputLabel>
                                        <Select
                                            fullWidth
                                            labelId="demo-simple-select-autowidth-label"
                                            id="demo-simple-select-autowidth"
                                            value={values.direccion}
                                            onChange={(e) => changeDirection(setFieldValue, `${e.target.value}`)}
                                            label="Dirección"
                                            MenuProps={MenuProps}

                                            // {...getFieldProps('direccion')}
                                            error={Boolean(touched.direccion && errors.direccion)}
                                            // helperText={touched.direccion && errors.direccion}
                                        >
                                            {departmentList.map((item, key) => {
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
                                            Departamento
                                        </InputLabel>
                                        <Select
                                            fullWidth
                                            labelId="demo-simple-select-autowidth-label"
                                            id="demo-simple-select-autowidth"
                                            value={values.departamento}
                                            onChange={(e) => changeSubDepartment(setFieldValue, `${e.target.value}`)}
                                            label="Departamento"
                                            MenuProps={MenuProps}
                                            disabled={subDepartmentList.length === 0}

                                            // {...getFieldProps('departamento')}
                                            error={Boolean(touched.departamento && errors.departamento)}
                                            // helperText={touched.departamento && errors.departamento}
                                        >
                                            {subDepartmentList.map((item, key) => {
                                                let dataItem = item;
                                                return <MenuItem key={key} value={`${dataItem.id}`}>
                                                            {dataItem.name}
                                                        </MenuItem>
                                            })}
                                        </Select>
                                    </FormControl>
                                </Grid>

                                <Grid sx={{my:1}} item md={12} xs={12}>
                                    <FormControl fullWidth size="small">
                                        <InputLabel id="demo-simple-select-autowidth-label">
                                            Cargo
                                        </InputLabel>
                                        <Select
                                            fullWidth
                                            labelId="demo-simple-select-autowidth-label"
                                            id="demo-simple-select-autowidth"
                                            
                                            value={values.cargo}
                                            onChange={(e) => setFieldValue("cargo", `${e.target.value}`)}

                                            label="Cargo"
                                            MenuProps={MenuProps}
                                            disabled={cargoList.length === 0}

                                            // {...getFieldProps('cargo')}
                                            error={Boolean(touched.cargo && errors.cargo)}
                                            // helperText={touched.cargo && errors.cargo}
                                        >
                                            {cargoList.map((item, key) => {
                                                let dataItem = item;
                                                return <MenuItem key={key} value={`${dataItem.id}`}>
                                                            {dataItem.name}
                                                        </MenuItem>
                                            })}
                                        </Select>
                                    </FormControl>
                                </Grid>
                                
                                {/*
                                    <Grid item lg={6} sx={{my:1}}>
                                        <FormControl fullWidth size="small">
                                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                                <DatePicker
                                                    label="Fecha"
                                                    // value={formik.values.birthday}
                                                    onChange={(value) => {
                                                        // formik.setFieldValue('birthday', value);
                                                    }}
                                                    
                                                    renderInput={
                                                        (params) => <TextField 
                                                                    fullWidth
                                                                    size='small' 
                                                                    {...params} 
                                                        />
                                                    }
                                                />
                                            </LocalizationProvider>
                                        </FormControl>
                                    </Grid>
                                */}
                            </Grid>

                            <Box sx={{mt: 3, display: "flex"}}>
                                <LoadingButton type="submit" loading={isSubmitting} disabled={(values.cargo === "" || subDepartmentList.length === 0 || cargoList.length === 0)} sx={{px:3, mx:2}} color="primary" variant="contained" size="large">
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

export default Cargo