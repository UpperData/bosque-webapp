import React, {useState} from 'react'
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
import { toast } from 'react-toastify';

import axios from "../../../../../auth/fetch"

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
        width: 250,
      },
    },
};

const statusList = [
    {
        label: 'Activo',
        value: 'A'
    },
    {
        label: 'Inactivo',
        value: 'I'
    }
];

function ModalContract({ show = false, handleShowModal = (show) => {}, storeId = null, reset = () => {}, edit = null  }) {
    
    const [sending, setsending] = useState(false);
    const formSchema = Yup.object().shape({
        startDate:      Yup.date().nullable().required('Debe indicar una fecha de inicio'),
        endDate:        Yup.date().nullable().required('Debe indicar una fecha de culminación'),
        comission:      Yup.number().required('Ingrese una comisión'),
        fileContract:   Yup.string().required('Debe cargar un contrato'),
        isActived:      Yup.string().required('Debe seleccionar un status')
    });

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: edit ? 
        {
            startDate:      Date(edit.startDate),
            endDate:        Date(edit.endDate),
            comission:      edit.comission,
            fileContract:   edit.fileContract,
            isActived:      edit.isActived ? 'A' : 'I'
        }
        :
        {
            startDate:      null,
            endDate:        null,
            comission:      0,
            fileContract:   '',
            isActived:      'I'
        },
        validationSchema: formSchema,
        onSubmit: (values, {resetForm}) => {
            let data = {
                startDate:      moment(values.startDate).format('yyyy-MM-DD'),
                endDate:        moment(values.endDate).format('yyyy-MM-DD'),
                comission:      values.comission.toString(),
                fileContract:   values.fileContract,
                isActived:      values.isActived === 'A',
                storeId
            }

            console.log(data);
            setsending(true);

            if(edit){
                // edit
            }else{
                const url = '/admIn/sTORE/contract/Create';
                axios.post(url, data).then((res) => {
                    console.log(res.data);

                    setsending(false);
                    resetForm();
                    toast.success('Contrato creado satisfactoriamente!');
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

    return (
        <div>
            <Modal     
                open={show}
                onClose={() => handleShowModal(false)}
                aria-labelledby="modal-title"
                aria-describedby="modal-description"
                style={{ 
                    display:'flex', 
                    alignItems:'center', 
                    justifyContent:'center',
                }}
                
            >
                <Box sx={{...style, p: 5, borderRadius: 2}}>
                    <Typography variant="h5" alignItems="center" sx={{mb: 3}}>
                        {edit ? `Editar contrato` : `Crear contrato`}
                    </Typography>
                    <div>

                        <FormikProvider value={formik}>
                            <Form 
                                autoComplete="off" 
                                noValidate 
                                onSubmit={handleSubmit}
                            >

                                <Box sx={{mb: 2}}>

                                    <Grid container columnSpacing={3}>
                                        <Grid item md={7} xs={12} sx={{mb: 2}}>

                                            <Box sx={{mb: 2}}>
                                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                                    <DatePicker
                                                        label="Fecha Inicio"
                                                        value={values.startDate}
                                                        onChange={(value) => {
                                                            formik.setFieldValue('startDate', value);
                                                        }}
                                                        
                                                        renderInput={
                                                            (params) => <TextField 
                                                                defaultValue={values.startDate}
                                                                fullWidth
                                                                size='small' 
                                                                {...getFieldProps('startDate')}
                                                                helperText={touched.startDate && errors.startDate} 
                                                                error={Boolean(touched.startDate && errors.startDate)} 
                                                                {...params} 
                                                            />
                                                        }
                                                    />
                                                </LocalizationProvider>
                                            </Box>
                                            <Box sx={{mb: 2}}>
                                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                                    <DatePicker
                                                        label="Fecha Final"
                                                        value={values.endDate}
                                                        onChange={(value) => {
                                                            formik.setFieldValue('endDate', value);
                                                        }}
                                                        
                                                        renderInput={
                                                            (params) => <TextField 
                                                                defaultValue={values.endDate}
                                                                fullWidth
                                                                size='small' 
                                                                {...getFieldProps('endDate')}
                                                                helperText={touched.endDate && errors.endDate} 
                                                                error={Boolean(touched.endDate && errors.endDate)} 
                                                                {...params} 
                                                            />
                                                        }
                                                    />
                                                </LocalizationProvider>
                                            </Box>
                                            <Box sx={{mb: 2}}>
                                                <TextField
                                                    label="Comisión"
                                                    size="small"
                                                    fullWidth
                                                    type='number'
                                                    inputProps={{
                                                        maxLength: 5,
                                                        step: ".01"
                                                    }}
                                                    defaultValue={values.comission}
                                                    // value={values.comission}
                                                    helperText={touched.comission && errors.comission} 
                                                    error={Boolean(touched.comission && errors.comission)} 
                                                    onChange={(e) => formik.setFieldValue('comission', parseFloat(e.target.value).toFixed(1))}
                                                    
                                                    // placeholder="Nombre del grupo"
                                                    // value={nameNewGroup}
                                                    // onChange={(e) => setnameNewGroup(e.target.value)}
                                                    // disabled={search}
                                                />
                                            </Box>
                                            <FormControl fullWidth size="small" sx={{mb: 2}}>
                                                <InputLabel id="status-autowidth-label">
                                                    Estatus
                                                </InputLabel>
                                                <Select
                                                    fullWidth
                                                    labelId="status-autowidth-label"
                                                    id="status-autowidth"
                                                    value={values.isActived}
                                                    onChange={(e) => formik.setFieldValue('isActived', e.target.value)}
                                                    helperText={touched.isActived && errors.isActived} 
                                                    error={Boolean(touched.isActived && errors.isActived)} 
                                                    label="Grupos"
                                                    MenuProps={MenuProps}
                                                >
                                                    {statusList.map((item, key) => {
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
                                                // disabled={sending} 
                                                size="large" 
                                                sx={{mx: 1}} 
                                                onClick={() => handleShowModal(false)}
                                            >
                                                Cancelar
                                            </Button>
                                        </Grid>
                                        <Grid item md={5} xs={12} sx={{mb: 2}}>
                                            {values.fileContract === '' &&
                                                <Alert sx={{mb: 3}} severity="info">
                                                    Solo formato pdf
                                                </Alert>
                                            }
                                            <ContractUploader 
                                                value={values.fileContract}
                                                onChange={(fileString) => setFieldValue('fileContract', fileString)}
                                            />
                                        </Grid>
                                    </Grid>
                                </Box>
                            </Form>
                        </FormikProvider>
                    </div>
                </Box>
            </Modal>
        </div>
    );
}

export default ModalContract