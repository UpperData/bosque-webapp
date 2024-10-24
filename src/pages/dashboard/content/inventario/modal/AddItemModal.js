import React, {useEffect, useState} from 'react'

import {     
    Grid,    
    Typography,       
    Card, 
    Modal, 
    TextField,     
    Select, 
    MenuItem,     
    FormControl    
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
    resetM = () => {}, 
    permissions = null,
    article = null,
    articleId=null,
    currentItem=null 

}) {  
    
    const urlLots                                    = "/inVenTory/LotS/ITEMS";
    const [typeForm, settypeForm]                       = useState("create");
    const [itemToEdit, setitemToEdit]                   = useState(null);
    const [search, setsearch]                           = useState(true);
    const [alertSuccessMessage, setalertSuccessMessage] = useState("");
    const [alertErrorMessage,   setalertErrorMessage]   = useState("");    
    const [sending, setsending] = useState(false);
    const [currentNumItem,setCurrentNumItem]            =useState(currentItem.numItem);
   
    const LoginSchema =     Yup.object().shape({
        name:               Yup.string().required('Debe ingresar un nombre'),  
        description:        Yup.string().required('Debe ingresar una descripción'),        
    });
     
  
    const formik = useFormik({
        validateOnChange: true,
        initialValues: {
            id:     "",
            lotId:  "",
            items:  [{        
                        weight:"",
                        conditionId:"",
                        note:"",
                        numItem:""
                    }]
            
        },
        // validationSchema: LoginSchema,
        onSubmit: async (values, {resetForm}) => {
            
            let data = { 
                id:         currentItem.id,      
                lotId:      currentItem.lotId, 
                articleId,
                items:      [{        
                                weight:values.weight?values.weight:currentItem.weight,
                                conditionId:values.conditionId?values.conditionId:currentItem.conditionId,
                                note:values.note?values.note:currentItem.note,
                                numItem:values.numItem?values.numItem:currentItem.numItem
                            }]
            }
                    
            setsending(true);
            
            axios({
                method: currentItem.id > 0 ?   "PUT" :"POST",
                url:    urlLots,
                data
            }).then((res) => {
                setsending(false);
                numItem();
                if(res.data.result){                        
                    
                    toast.success(res.data.message);                        
                    // resetForm();
                                       
                
                }else{
                    toast.warning(res.data.message);
                }
                reset(); 
                

            }).catch((err) => {
                console.log('__Error procesando lote____');
                console.log(err.response);
                           
            });

            
        }
    });
    
    const numItem =  async ()  => {       
        const url = '/Inventory/currentNumItem/'+articleId;
         axios.get(url).then((res) => {           
            if(res.result){
                setCurrentNumItem(res.data.nextItem);  
            }
        }).catch((err) => {
            console.error(err);
        });
    } 
    const { errors, touched, values, isSubmitting, handleSubmit, getFieldProps, setFieldValue, resetForm } = formik;    
    useEffect( () => {
        if(currentItem.id===0){                    
            numItem();
        } 
    },
    [currentItem]
    ); 
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
                                <Grid item md={3}>
                                        {/* Fecha recibido */}
                                        <FormControl fullWidth size="90" sx={{mb: 2}}>
                                            <TextField
                                                InputLabelProps={{
                                                    shrink: true,
                                                }}
                                                label="Num."
                                                type="number"                                               
                                                required
                                                fullWidth 
                                                name="numItem"
                                                id="numItem"
                                                value={currentNumItem}
                                                // defaultValue={currentItem.numItem||currentNumItem.nextItem} 
                                                // defaultValue={currentItem.numItem!==''?currentItem.numItem:currentNumItem.nextItem}                                                  
                                                // onChange={(e) => formik.setFieldValue('numItem', e.target.value)}                                            
                                                onChange={(e)=>setCurrentNumItem(e.target.value)}
                                                placeholder="Num"
                                            /> 
                                        </FormControl>    
                                    </Grid>                                                             
                                    <Grid item md={4}>
                                        {/* Fecha recibido */}
                                        <FormControl fullWidth size="small" sx={{mb: 2}}>
                                            <TextField
                                                InputLabelProps={{
                                                    shrink: true,
                                                }}
                                                label="Peso"
                                                type="number"                                                
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
                                    <Grid item md={5}>
                                        {/* existencia */}
                                        <FormControl fullWidth  sx={{mb: 2}}>
                                        <Select defaultValue={currentItem.conditionId||1}
                                        
                                         onChange={(e) => formik.setFieldValue('conditionId', e.target.value)} 
                                        >
                                            <MenuItem  value={0}>Seleccione</MenuItem >
                                            <MenuItem  value={1} selected>Disponible</MenuItem >
                                            <MenuItem  value={2}>Reservado</MenuItem >
                                            <MenuItem  value={3}>Vendido</MenuItem >
                                            <MenuItem  value={4}>Elimando</MenuItem >
                                        </Select> 
                                        </FormControl>    
                                    </Grid>
                                    <Grid item md={12}>
                                        {/* Nota */}                                    
                                        <FormControl fullWidth  sx={{mb: 2}}>                                    
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