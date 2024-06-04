import React, {useEffect, useState} from 'react'
import { 
    Box, 
    Grid, 
    Typography,
    Button, 
    Modal, 
    TextField, 
    Select, 
    MenuItem, 
    InputLabel, 
    FormControl,
    Alert
} from '@mui/material';
import { LoadingButton, DatePicker, LocalizationProvider, TimePicker  } from '@mui/lab';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import ContractUploader from './contractUploader';
import * as Yup from 'yup';
import { useFormik, Form, FormikProvider } from 'formik';
import moment from "moment";

import axios from "../../../../../auth/fetch"
import Loader from '../../../../../components/Loader/Loader';
import ModalDirection from '../../citas/ModalDirection';
import ImageUploader from './imageUploader';
import { toast } from 'react-toastify';

const style = {
    width: "95%",
    margin: "auto",
    maxWidth: "750px",
    backgroundColor: "#fff",
    userSelect: "none",
    boxShadow: 'none',
};

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        // width: 150,
      },
    },
};

const docTypesList = [
    {
        label: 'J',
        value: 'J'
    },
    {
        label: 'V',
        value: 'V'
    }
];

function ModalStore({ show = false, handleShowModal = (show) => {}, reset = () => {}, edit = null  }) {

    const [loading, setloading] = useState(true);
    const [sending, setsending] = useState(false);
    const [usersList, setusersList] = useState([]);

    const [showModalAddDirection,   setshowModalAddDirection] = useState(false);
    const [direction, setdirection] = useState(null);

    const formSchema = Yup.object().shape({
        accountId:      Yup.string().nullable().required('Seleccione una cuenta'),
        logo:           Yup.string().required('Debe cargar el logo de la tienda'),
        name:           Yup.string().required('Debe ingresar un nombre'),
        description:    Yup.string().required('Debe ingresar una descripción'),

        address:        Yup.string().required('Debe ingresar una dirección'),
        phone:          Yup.string().required('Debe ingresar un teléfono'),

        parroquiaId:    Yup.number().nullable().required('Seleccione una parroquia'),

        sigla:          Yup.string().required('Seleccione'),
        number:         Yup.number().required('Ingrese su número de documento'),
    });

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: edit ?
        {
            accountId:          edit.id,
            logo:               edit.logo && edit.logo !== 'null' ? edit.logo : '',
            name:               edit.name,
            description:        edit.description,
            phone:              edit.phone,
            address:            edit.address,
            parroquiaId:        edit.parroquiaId,

            // fiscal info
            sigla:              edit.fiscalInfo.rif.sigla.toUpperCase(),
            number:             edit.fiscalInfo.rif.number,

            isActived:          edit.isActived,
            isItHaveBuild:      edit.isItHaveBuild,
            deliveryInfo:       {
                deliveryInfo: true
            }
        }
        :
        {
            accountId:          '',
            logo:               '',
            name:               '',
            description:        '',
            phone:              '',
            address:            '',
            parroquiaId:        null,

            // fiscal info
            sigla:              "",
            number:             "",

            isActived:          true,
            isItHaveBuild:      false,
            deliveryInfo:       {
                deliveryInfo: true
            }
        },
        validationSchema: formSchema,
        onSubmit: (values, { resetForm }) => {

            let data = {
                ...values,
                fiscalInfo: {
                    rif: {
                        number: values.number,
                        sigla: values.sigla
                    }
                }
            }

            if(data.sigla === 'V'){
                data.storeTypeId = 2;
            }else if(data.sigla === 'J'){
                data.storeTypeId = 1;
            }

            delete data.sigla;
            delete data.number;

            setsending(true);
            console.log(data);

            if(!edit){
                const url = '/admIn/sTORE/Create';
                axios.post(url, data).then((res) => {

                    console.log(res.data);
                    setsending(false);
                    resetForm();
                    toast.success('Tienda creada satisfactoriamente!');
                    reset();

                }).catch((err) => {

                    console.error(err);
                    toast.error('Ha ocurrido un error inesperado');
                    setsending(false);

                });
            }else{

                delete data.accountId;
                data.id = edit.id;

                const url = '/admin/store/Edit';
                axios.put(url, data).then((res) => {

                    console.log(res.data);
                    setsending(false);
                    resetForm();
                    toast.success('Tienda editada satisfactoriamente!');
                    reset();

                }).catch((err) => {

                    console.error(err);
                    toast.error('Ha ocurrido un error inesperado');
                    setsending(false);
                });

            }          
        }
    });

    const { errors, touched, handleSubmit, isSubmitting, getFieldProps,setFieldValue, values } = formik;

    console.log(edit);
    console.log(errors);
    console.log(direction);

    const getData = () => {
        const url = '/account/actives/get';
        axios.get(url).then((res) => {
            console.log(res.data);
            setloading(false);
            setusersList(res.data.data);
        }).catch((err) => {
            console.error(err);
        });
    }

    useEffect(() => {
      if(loading){
        if(edit){   
            let directionData = edit.parroquium;
            setdirection({
                ciudad: {id: directionData.province.state.id, name: directionData.province.state.name},
                estado: {id: directionData.province.state.id, name: directionData.province.state.name},
                municipio: {id: directionData.province.id, name: directionData.province.name},
                parroquia: {id: directionData.id, name: directionData.name}
            });
            setTimeout(() => {
                setloading(false);
            }, 1000);
        }else{
            getData();
        }
      }
    }, []);
    
    return (
        <>
        <ModalDirection 
            withoutDirection 
            save={(data) => {
                if(data['parroquia']){
                    setdirection(data);
                    formik.setFieldValue('parroquiaId', data['parroquia']['id']);
                }
            }} 
            show={showModalAddDirection} 
            hide={() => setshowModalAddDirection(false)} 
        />
        <Modal     
            open={show}
            onClose={() => handleShowModal(false)}
            aria-labelledby="modal-title"
            aria-describedby="modal-description"
            style={{ 
                display:'flex', 
                alignItems:'center', 
                justifyContent:'center',
                zIndex: 1200
            }}
            
        >
            <Box sx={{...style, p: 5, borderRadius: 2}}>
                <Typography variant="h5" alignItems="center" sx={{mb: 3}}>
                    {edit ? `Editar tienda` : `Crear tienda`}
                </Typography>
                {!loading ?
                    <div>
                        <FormikProvider value={formik}>
                            <Form 
                                autoComplete="off" 
                                noValidate 
                                onSubmit={handleSubmit}
                            >
                                <Grid container columnSpacing={3}>
                                    <Grid item md={7} xs={12}>
                                        {!edit &&
                                            <FormControl fullWidth size="small" sx={{mb: 2}}>
                                                <InputLabel id="status-autowidth-label">
                                                    Cuenta de usuario (Email)
                                                </InputLabel>
                                                <Select
                                                    fullWidth
                                                    labelId="status-autowidth-label"
                                                    id="status-autowidth"
                                                    // value={values.isActived}
                                                    onChange={(e) => formik.setFieldValue('accountId', e.target.value)}
                                                    helperText={touched.accountId && errors.accountId} 
                                                    error={Boolean(touched.accountId && errors.accountId)} 

                                                    label="Cuenta de usuario (Email)"
                                                    MenuProps={MenuProps}
                                                >
                                                    {usersList.map((item, key) => {
                                                        let dataItem = item;
                                                        return <MenuItem 
                                                            key={key} 
                                                            value={dataItem.id}
                                                        >
                                                            {dataItem.email}
                                                        </MenuItem>
                                                    })}
                                                </Select>
                                            </FormControl>
                                        }
                                        <FormControl fullWidth size="small" sx={{mb: 2}}>
                                            <TextField
                                                label="Nombre de la tienda"
                                                size="small"
                                                fullWidth
                                                // value={values.comission}
                                                defaultValue={values.name}
                                                helperText={touched.name && errors.name} 
                                                error={Boolean(touched.name && errors.name)} 
                                                onChange={(e) => formik.setFieldValue('name', e.target.value)}
                                                
                                                // placeholder="Nombre del grupo"
                                                // value={nameNewGroup}
                                                // onChange={(e) => setnameNewGroup(e.target.value)}
                                                // disabled={search}
                                            />
                                        </FormControl>
                                        <FormControl fullWidth size="small" sx={{mb: 2}}>
                                            <TextField
                                                label="Descripción"
                                                size="small"
                                                fullWidth
                                                minRows={3}
                                                multiline
                                                // value={values.comission}
                                                defaultValue={values.description}
                                                helperText={touched.description && errors.description} 
                                                error={Boolean(touched.description && errors.description)} 
                                                onChange={(e) => formik.setFieldValue('description', e.target.value)}
                                                
                                                // placeholder="Nombre del grupo"
                                                // value={nameNewGroup}
                                                // onChange={(e) => setnameNewGroup(e.target.value)}
                                                // disabled={search}
                                            />
                                        </FormControl>

                                        
                                        <Grid item md={12} xs={12}>
                                            <Grid container columnSpacing={2}>
                                                <Grid item md={3} xs={12}>
                                                    <FormControl fullWidth size="small" sx={{mb: 2}}>
                                                        <InputLabel id="status-autowidth-label">
                                                            Tipo
                                                        </InputLabel>
                                                        <Select
                                                            fullWidth
                                                            labelId="status-autowidth-label"
                                                            id="status-autowidth"
                                                            // value={values.isActived}
                                                            value={values.sigla}
                                                            onChange={(e) => formik.setFieldValue('sigla', e.target.value)}
                                                            helperText={touched.sigla && errors.sigla} 
                                                            error={Boolean(touched.sigla && errors.sigla)} 
                                                            
                                                            label="Tipo"
                                                            MenuProps={MenuProps}
                                                        >
                                                            {docTypesList.map((item, key) => {
                                                                let dataItem = item;
                                                                return <MenuItem 
                                                                    key={key} 
                                                                    value={dataItem.value}
                                                                >
                                                                    {dataItem.label}
                                                                </MenuItem>
                                                            })}
                                                        </Select>
                                                    </FormControl>
                                                </Grid>
                                                <Grid item md={9} xs={12}>
                                                    <FormControl fullWidth size="small" sx={{mb: 2}}>
                                                        <TextField
                                                            label="Rif"
                                                            size="small"
                                                            fullWidth
                                                            // value={values.comission}
                                                            defaultValue={values.number}
                                                            helperText={touched.number && errors.number} 
                                                            error={Boolean(touched.number && errors.number)} 
                                                            onChange={(e) => formik.setFieldValue('number', e.target.value)}
                                                            
                                                            // placeholder="Nombre del grupo"
                                                            // value={nameNewGroup}
                                                            // onChange={(e) => setnameNewGroup(e.target.value)}
                                                            // disabled={search}
                                                        />
                                                    </FormControl>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    
                                    </Grid>
                                    <Grid item md={5} xs={12}>
                                        {touched.logo && errors.logo ? 
                                            <Alert sx={{mb: 3}} severity="error">
                                                Debe seleccionar una imagen
                                            </Alert>
                                        :
                                            <div>
                                                {values.logo === '' &&
                                                    <Alert sx={{mb: 3}} severity="info">
                                                        Seleccione una imagen
                                                    </Alert>
                                                }
                                            </div>
                                        }
                                        
                                        <ImageUploader
                                            value={values.logo}
                                            onChange={(val) => formik.setFieldValue('logo', val)}
                                        />
                                    </Grid>
                                    <Grid item md={12} xs={12}>
                                        <div>
                                            <Grid container columnSpacing={3}>
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
                                                <Grid md={9} xs={12} item>
                                                    {direction === null &&
                                                        <div>
                                                            {touched.description && errors.description ? 
                                                                <Alert severity="info">
                                                                    No se ha seleccionado una dirección
                                                                </Alert>
                                                            :
                                                                <Alert sx={{mb: 3}} severity="error">
                                                                    Debe ingresar una dirección
                                                                </Alert>
                                                            }
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
                                                <Grid item xs={12} md={6}>
                                                    <FormControl fullWidth size="small" sx={{mb: 2}}>
                                                        <TextField
                                                            label="Dirección"
                                                            size="small"
                                                            fullWidth
                                                            // value={values.comission}
                                                            defaultValue={values.address}
                                                            helperText={touched.address && errors.address} 
                                                            error={Boolean(touched.address && errors.address)} 
                                                            onChange={(e) => formik.setFieldValue('address', e.target.value)}
                                                            
                                                            // placeholder="Nombre del grupo"
                                                            // value={nameNewGroup}
                                                            // onChange={(e) => setnameNewGroup(e.target.value)}
                                                            // disabled={search}
                                                        />
                                                    </FormControl>
                                                </Grid>
                                                <Grid item xs={12} md={6}>
                                                    <FormControl fullWidth size="small" sx={{mb: 2}}>
                                                        <TextField
                                                            label="Teléfono"
                                                            size="small"
                                                            fullWidth
                                                            // value={values.comission}
                                                            defaultValue={values.phone}
                                                            helperText={touched.phone && errors.phone} 
                                                            error={Boolean(touched.phone && errors.phone)} 
                                                            onChange={(e) => formik.setFieldValue('phone', e.target.value)}
                                                            
                                                            // placeholder="Nombre del grupo"
                                                            // value={nameNewGroup}
                                                            // onChange={(e) => setnameNewGroup(e.target.value)}
                                                            // disabled={search}
                                                        />
                                                    </FormControl>
                                                </Grid>
                                            </Grid>
                                        </div>
                                    </Grid>
                                </Grid>
                                
                                <Box flex justifyContent="center">
                                    <LoadingButton 
                                        variant="contained" 
                                        color="primary"
                                        type="submit"
                                        sx={{pmx: 1, py: 1.5}}
                                        // onClick={() => addGroup()}
                                        loading={sending}
                                        disabled={sending}
                                    >
                                        {edit ? `Editar` : `Guardar`}
                                    </LoadingButton>
                                    <Button 
                                        disabled={sending} 
                                        size="large" 
                                        sx={{mx: 1}} 
                                        onClick={() => handleShowModal(false)}
                                    >
                                        Cancelar
                                    </Button>
                                </Box>
                            </Form>
                        </FormikProvider>
                    </div> 
                :
                    <Loader />
                }
            </Box>
        </Modal>
        </>
    )
}

export default ModalStore
