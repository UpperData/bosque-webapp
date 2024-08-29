import React, {useEffect, useState} from 'react'

import { 
    Box, 
    Grid, 
    Stack, 
    ButtonGroup, 
    Tooltip, 
    Container, 
    Typography, 
    Alert,  
    Card, 
    CardContent, 
    Hidden, 
    Button, 
    Modal, 
    TextField, 
    Checkbox, 
    Select, 
    MenuItem, 
    InputLabel, 
   
    FormControl,
    Switch,
    FormControlLabel
} from '@mui/material';


import { LoadingButton } from '@mui/lab';
import { alpha, styled } from '@mui/material/styles';

import * as Yup from 'yup';
import { useFormik, Form, FormikProvider } from 'formik';
import moment from "moment";

import axios from "../../../../../auth/fetch"
import Loader from '../../../../../components/Loader/Loader';
import { toast } from 'react-toastify';

const style = {
    width: "95%",
    margin: "auto",
    maxWidth: "750px",
    backgroundColor: "#fff",
    userSelect: "none",
    boxShadow: 'none',
};

const RootStyle = styled(Card)(({ theme }) => ({
    boxShadow: 'none',
    textAlign: 'center',
    padding: theme.spacing(5, 5),
    width: "95%",
    margin: "auto",
    maxWidth: "600px",
    backgroundColor: "#fff",
}));

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

function AddLotModal({ 
    show = false, 
    handleShowModal = (show) => {}, 
    reset = () => {},
    permissions = null,
    article = null,
    currentItem=null   

}) {   
    
    const urlLots                                    = "/inVenTory/LotS/ITEMS";
    const [typeForm, settypeForm]                       = useState("create");
    const [itemToEdit, setitemToEdit]                   = useState(null);

    const [alertSuccessMessage, setalertSuccessMessage] = useState("");
    const [alertErrorMessage,   setalertErrorMessage]   = useState("");    
    const [sending, setsending]                         = useState(false);

    const LoginSchema =     Yup.object().shape({
        name:               Yup.string().required('Debe ingresar un nombre'),  
        description:        Yup.string().required('Debe ingresar una descripción'),        
    });
     
  
    const formik = useFormik({
        validateOnChange: false,
        initialValues: {
            id:     "",
            lotId:  "",
            items:  [{        
                        weight:"",
                        conditionId:"",
                        note:""
                    }]
            
        },
        // validationSchema: LoginSchema,
        onSubmit: async (values, {resetForm}) => {
            
            let data = { 
                id:         currentItem.id,      
                lotId:      currentItem.lotId, 
                items:      [{        
                                weight:values.weight?values.weight:currentItem.weight,
                                conditionId:values.conditionId?values.conditionId:currentItem.conditionId,
                                note:values.note?values.note:currentItem.note
                            }]
            }
                    
            setsending(true);
            
            axios({
                method: currentItem.id > 0 ?   "PUT" :"POST",
                url:    urlLots,
                data
            }).then((res) => {
                setsending(false);
                if(res.data.result){                        
                    if(reset){
                        toast.success(res.data.message);
                        resetForm();
                        reset();
                    }
                }else{
                    toast.warning(res.data.message);
                    
                }

            }).catch((err) => {
                console.log('__Error procesando lote____');
                console.log(err.response);
                           
            });

            
        }
    });
   
    const { errors, touched, values, isSubmitting, handleSubmit, getFieldProps, setFieldValue, resetForm } = formik;
    
    return (
        
        <Modal
                open={show}
                onClose={handleShowModal}
                aria-labelledby="modal-add-item-to-inventory"
                aria-describedby="modal-add-item-to-inventory"
                style={{ 
                    display:'flex', 
                    alignItems:'center', 
                    justifyContent:'center' 
                }}
            >
            <RootStyle>

                <FormikProvider value={formik}>
                    <Form autoComplete="off" noValidate onSubmit={handleSubmit } id="form1">
                        <Typography id="modal-modal-title" variant="h5" component="h5">
                            {currentItem.name + " - lote # "+ currentItem.lotId}
                        </Typography>
                        <Typography id="modal-modal-title" variant="h3" component="h3">
                            {currentItem.id>0? 'Editar item # ' +currentItem.id :  'Nuevo item'}
                        </Typography>
                        {/* Campos del lote */}
                        <br />
                        <Grid container columnSpacing={3}>
                            <Grid item md={12} xs={12}>

                                <Grid container columnSpacing={4}>                                                              
                                    <Grid item md={6}>
                                        {/* Fecha recibido */}
                                        <FormControl fullWidth size="small" sx={{mb: 2}}>
                                            <TextField
                                                InputLabelProps={{
                                                    shrink: true,
                                                }}
                                                label="Peso"
                                                type="number"
                                                size="small"
                                                required
                                                fullWidth 
                                                defaultValue={currentItem.weight!==''?currentItem.weight:values.weight}                                                  
                                                helperText={touched.weight && errors.weight} 
                                                error={Boolean(touched.weight && errors.weight)} 
                                                onChange={(e) => formik.setFieldValue('weight', e.target.value)}                                            
                                                placeholder="Peso"
                                            /> 
                                        </FormControl>    
                                    </Grid>
                                    <Grid item md={6}>
                                        {/* existencia */}
                                        <FormControl fullWidth size="small" sx={{mb: 2}}>
                                        <Select defaultValue={1}
                                         onChange={(e) => formik.setFieldValue('conditionId', e.target.value)} 
                                        >
                                            <MenuItem  value={1}>Disponible</MenuItem >
                                            <MenuItem  value={2}>Reservado</MenuItem >
                                            <MenuItem  tion value={3}>Vendido</MenuItem >
                                            <MenuItem  value={4}>Elimando</MenuItem >
                                        </Select> 
                                        </FormControl>    
                                    </Grid>
                                    <Grid item md={12}>
                                        {/* Nota */}                                    
                                        <FormControl fullWidth size="small" sx={{mb: 2}}>                                    
                                        <TextField                                    
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                            label="Nota relevante"
                                            size="small"
                                            fullWidth
                                            minRows={1}
                                            multiline 
                                            defaultValue={currentItem.note}
                                            helperText={touched.description && errors.description} 
                                            error={Boolean(touched.description && errors.description)} 
                                            onChange={(e) => formik.setFieldValue('note', e.target.value)}                                        
                                            placeholder="Nota relevante"
                                        />
                                        </FormControl>
                                    </Grid>                               
                                </Grid>
                            </Grid>
                        </Grid> 

                        <LoadingButton
                            fullWidth
                            size="large"
                            type="submit"
                            variant="contained"
                            loading={sending}
                            color="primary"
                            form="form1"
                        /* disabled={
                                (!permissions.crea && typeForm === "create") || 
                                (!permissions.edita && typeForm === "edit")  || 
                                (values.name === "" || values.description === "")
                            } */
                        >
                            {currentItem.id > 0? "Editar":"Agregar"}                           

                        </LoadingButton>
                    </Form>
                </FormikProvider>
            </RootStyle>
        </Modal>
    );
}

export default AddLotModal;