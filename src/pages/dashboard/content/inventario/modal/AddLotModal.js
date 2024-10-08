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
    maxWidth: "800px",
    backgroundColor: "#fff",
}));
const CloseModal = styled('div')(({ theme }) => ({
    position:'absolute',
    top:'20px',
    right:'20px',
    width:'30px',
    height:'30px',
    border:'none',
    background:'none',
    cursor:'pointer',
    transition: '.3s ease all',
    borderRadius:'5px',
    color:'#1766DC',
    hover:{
     background:'#F2F2F2'
    },
    svg:{
         width:'100%',
         height:'100%'
    }
 
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
    currentLot=null   

}) {
   
    
    const urlLots                                    = "/inVenTory/LOTS";
    const [typeForm, settypeForm]                       = useState("create");
    const [itemToEdit, setitemToEdit]                   = useState(null);

    const [alertSuccessMessage, setalertSuccessMessage] = useState("");
    const [alertErrorMessage,   setalertErrorMessage]   = useState("");
    const [isActived,setIsActived]=useState(false);
    const [sending, setsending]                         = useState(false);

    const LoginSchema =     Yup.object().shape({
        name:               Yup.string().required('Debe ingresar un nombre'),  
        description:        Yup.string().required('Debe ingresar una descripción'),        
    });
    const handleChange = (event) => {
        setIsActived( event.target.checked);
      };  
  
    const formik = useFormik({
        validateOnChange: false,
        initialValues: {
            lotId:        currentLot.id,
            articleId:    currentLot.articleId>0 ? currentLot.articleId:"",
            receivedDate: currentLot.receivedDate ? currentLot.receivedDate:moment().format('YYYY-MM-DD h:mm:ss'),
            expDate:      currentLot.expDate ? currentLot.expDate:moment().format('YYYY-MM-DD h:mm:ss'),
            note:         currentLot.note ? currentLot.note:"",
            isActived:    currentLot.isActived ? currentLot.isActived:""
        },
        // validationSchema: LoginSchema,
        onSubmit: async (values, {resetForm}) => {
            
            let data = {
                lotId:      currentLot.id,  
                articleId:    article.id,
                receivedDate: !values.receivedDate?currentLot.receivedDate:moment(values.receivedDate).format('YYYY-MM-DD h:mm:ss'),
                expDate:      !values.expDate?currentLot.expDate:moment(values.expDate).format('YYYY-MM-DD h:mm:ss'),
                note:         values.note,
                isActived,
                items: []
            }                    
            setsending(true);            
            axios({
                method: currentLot.id > 0 ?   "PUT" :"POST",
                url:    urlLots,
                data
            }).then((res) => {
                setsending(false);
                if(res.data.result){                        
                    if(reset){
                        toast.success(res.data.message);
                        resetForm();
                        reset();
                        handleShowModal(false);
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
    useEffect(() => {               
        
        setIsActived(currentLot.isActived);
         
    },[]);
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
                        <CloseModal onClick={() => handleShowModal(false)}> 
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-x-lg" viewBox="0 0 16 16">
                                <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z"/>
                            </svg>
                        </CloseModal>
                        <Typography id="modal-modal-title" variant="h5" component="h5">
                            {article.name}
                        </Typography>
                        <Typography id="modal-modal-title" variant="h3" component="h3">
                            {currentLot.id>0? 'Editar lote # ' +currentLot.id + " - " + moment(currentLot.receivedDate).format('DD/MM/YYYY'):  'Nuevo lote'}
                        </Typography>
                        {/* Campos del lote */}
                        <br />
                        <Grid container columnSpacing={3}>
                            <Grid item md={12} xs={12}>

                                <Grid container columnSpacing={4}>                                                              
                                    <Grid item md={4}>
                                        {/* Fecha recibido */}
                                        <FormControl fullWidth size="small" sx={{mb: 2}}>
                                            <TextField
                                                InputLabelProps={{
                                                    shrink: true,
                                                }}
                                                label="Recibido"
                                                type="date"
                                                size="small"
                                                required
                                                fullWidth 
                                                defaultValue={currentLot.receivedDate!==''?moment(currentLot.receivedDate).format('YYYY-MM-DD'):moment().format('YYYY-MM-DD')}                                                  
                                                helperText={touched.receivedDate && errors.receivedDate} 
                                                error={Boolean(touched.receivedDate && errors.receivedDate)} 
                                                onChange={(e) => formik.setFieldValue('receivedDate', e.target.value)}                                            
                                                placeholder="Recibido"
                                            /> 
                                        </FormControl>    
                                    </Grid>
                                    <Grid item md={4}>
                                        {/* existencia */}
                                        <FormControl fullWidth size="small" sx={{mb: 2}}>
                                            <TextField
                                                InputLabelProps={{
                                                    shrink: true,
                                                }}
                                                label="Vencimiento"
                                                type="date"
                                                size="small"
                                                required
                                                fullWidth
                                                defaultValue={currentLot.expDate?moment(currentLot.expDate).format('YYYY-MM-DD'): moment().format('YYYY-MM-DD')}                                                
                                                error={Boolean(touched.expDate && errors.expDate)} 
                                                onChange={(e) => formik.setFieldValue('expDate', e.target.value)}                                            
                                                placeholder="Vencimiento"
                                            /> 
                                        </FormControl>    
                                    </Grid>                                
                                    <Grid item md={3}>
                                        {/* estatus del lote */}
                                        
                                        <FormControlLabel
                                            width="200"
                                            control={
                                            <Switch
                                                onChange={handleChange}
                                                name="isActived"
                                                color="primary"
                                                defaultChecked={currentLot.isActived}
                                                                                                                                              
                                            />
                                            }                                            
                                            label={isActived ? "Activo" : "Inactivo"}
                                        />  
                                    </Grid>
                                    <Grid item md={9}>
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
                                            defaultValue={currentLot.note}
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
                            {currentLot.id > 0? "Editar":"Agregar"}                           

                        </LoadingButton>
                    </Form>
                </FormikProvider>
            </RootStyle>
        </Modal>
    );
}

export default AddLotModal;