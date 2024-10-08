import React, {useEffect, useState} from 'react'

import {     
    Grid, 
    Stack,
    Typography,       
    Card, 
    Modal, 
    TextField, 
   Radio,
    FormControl,
    Switch,
    FormControlLabel,
    RadioGroup,
    
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

function AddArticleModal({ 
    show = false, 
    handleShowModal = (show) => {
       
    }, 
    reset = () => {},
    permissions = null,
    edit = null,
    actionType=null
}) {
    
    const urlNewItem                                    = "/INVETOry/aricle/new";
    const urlEditItem                                   = "/InVETOrY/aricLe/EdIT";
    const [isActived,setIsActived]                      =useState(edit?edit.isActived:false);
    const [isSUW,setIsSUW]                                =useState(edit?edit.isSUW:false);
    const [isPublished,setIsPublished]                  =useState(edit?edit.isPublished:false);
    const [typeForm, settypeForm]                       = useState(actionType);
    const [itemToEdit, setitemToEdit]                   = useState(null);
    const [showAddArticleModal, setshowAddArticleModal] = useState(false);
    const [alertSuccessMessage, setalertSuccessMessage] = useState("");
    const [alertErrorMessage,   setalertErrorMessage]   = useState("");
  
    const handleChangeStatus = (event) => {    
        setIsActived(event.target.value);
      }; 
    const handleChangeSUW  =(event) => {
        
        setIsSUW(event.target.value);
      };  
    const [sending, setsending]                         = useState(false);

    const LoginSchema =     Yup.object().shape({
        name:               Yup.string().required('Debe ingresar un nombre'),  
        description:        Yup.string().required('Debe ingresar una descripción'),        
        image:              Yup.string().required('Debe ingresar URL'), 
        price:              Yup.number().required('Debe ingresar precio'), 
        minStock:           Yup.number().required('Debe ingresar stock'),
    });

    const formik = useFormik({
        validateOnChange: false,
        initialValues: {
            name:             "",
            description:      "",            
            price:            "",
            image:            "",
            minStock:         "",
            isActived:        "",
            isSUW:            ""
        },
        // validationSchema: LoginSchema,
        onSubmit: async (values, {resetForm}) => {
            try {
                    
                let data = {
                    id:           edit.id,  
                    name:         !values.name?edit.name:values.name,
                    description:  !values.description?edit.description:values.description,
                    minStock:     !values.minStock?edit.minStock:values.minStock,
                    image:        !values.image?edit.image:values.image,
                    price:        !values.price?edit.price:values.price,
                    isActived,
                    isSUW
                }                
                setsending(true);
                axios({
                    method: typeForm === "create" ? "POST" : "PUT",
                    url:    typeForm === "create" ? urlNewItem : urlEditItem,
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
                        toast.success(res.data.message);
                    }

                }).catch((err) => {
                    let fetchError = err;                       
                    if(!fetchError.response.data.data.result){                                                
                        toast.warning(err.response.data.data.message);                        
                        setsending(false);
                    }
                });

            } catch(e) {
                setalertErrorMessage(e.response.data.data.message);
            }
        }
    });

    const { errors, touched, values, isSubmitting, handleSubmit, getFieldProps, setFieldValue, resetForm } = formik;

    return (
        <Modal
                open={show}
                onClose={() => handleShowModal(false)}
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
                    <Form autoComplete="off" noValidate onSubmit={handleSubmit} id="form1">
                    <CloseModal onClick={() => handleShowModal(false)}> 
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-x-lg" viewBox="0 0 16 16">
                            <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z"/>
                        </svg>
                    </CloseModal>
                    <Typography id="modal-modal-title" variant="h3" component="h3">
                        {typeForm === "create" ? "Agregar un artículo" : "Editar un artículo"}
                    </Typography>

                    <Grid container sx={{ mt: 3 }} columnSpacing={3}>
                        <Grid sx={{mb: 2}} item md={typeForm === "create" ? 4 : 4} xs={4}>
                            <Stack spacing={1}>
                                <TextField
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    size='small'
                                    fullWidth
                                    autoComplete="name"
                                    type="text"
                                    label="Nombre"
                                    required
                                    defaultValue={edit?edit.name:""}
                                    onChange={(e) => formik.setFieldValue('name', e.target.value)}                        
                                    error={Boolean(touched.name && errors.name)}
                                    helperText={touched.name && errors.name}  
                                                                     
                                />         
                            </Stack>
                        </Grid>
                        <Grid sx={{mb: 2}} item md={typeForm === "create" ? 4 : 4} xs={4}>
                            <Stack spacing={1}>
                                <TextField
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    size='small'
                                    fullWidth
                                    autoComplete="price"
                                    type="number"
                                    label="Precio"
                                    required
                                    defaultValue={edit?edit.price:""} 
                                    onChange={(e) => formik.setFieldValue('price', e.target.value)} 
                                    error={Boolean(touched.price && errors.price)}
                                    helperText={touched.price && errors.price}
                                />         
                            </Stack>
                        </Grid>
                    
                        <Grid sx={{mb: 2}} item md={4} xs={4}>
                            <Stack spacing={1}>
                                <TextField
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    size='small'
                                    fullWidth
                                    autoComplete="Stock min."
                                    type="number"
                                    label="Stock min."
                                    required
                                    InputProps={{
                                        type: "number"
                                    }}
                                    onChange={(e) => formik.setFieldValue('minStock', e.target.value)} 
                                    defaultValue={edit?edit.minStock:""} 
                                    error={Boolean(touched.minStock && errors.minStock)}
                                    helperText={touched.minStock && errors.minStock}
                                />         
                            </Stack>
                        </Grid>
                        <Grid item md={3}>
                            {/* estatus del lote */}
                            
                            <FormControlLabel
                                width="200"
                                control={
                                <Switch
                                    onChange={handleChangeStatus}
                                    name="isActived"
                                    color="primary"                                                      
                                    defaultChecked={edit?edit.isActived:true}                                          
                                />
                                }                                            
                                label={isActived ? "Activo" : "Inactivo"}
                            />  
                        </Grid>
                        <Grid item md={6}>
                            {/* Tipo de venta del producto */}
                            <RadioGroup
                                    row                                
                                    aria-labelledby="demo-controlled-radio-buttons-group"
                                    name="controlled-radio-buttons-group"
                                    // value={value}
                                    onChange={handleChangeSUW}
                                    defaultValue={edit?edit.isSUW:true} 
                                    
                                >
                                    <FormControlLabel value="false" control={<Radio />} color = "secondary" label="Granel" />
                                    <FormControlLabel value="true" control={<Radio /> } label="Unidad" />
                            </RadioGroup>
                                
                        </Grid>
                        <Grid item md={2}>
                            {/* Tipo de venta del producto */}
                            
                            <Typography 
                                sx={{
                                    fontWeight: 'bold', 
                                    align:'justify'
                                    
                                }} 
                                fullWidth 
                               
                            >
                            {isPublished?"Publicado":" Sin Publicar"} 
                        </Typography> 
                        </Grid>
                        <Grid sx={{mb: 2}} item xs={12}>
                            <FormControl fullWidth size="small" sx={{mb: 2}}>
                                <TextField
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    label="URL imagen"
                                    size="small"
                                    fullWidth
                                    required                                    
                                    defaultValue={edit?edit.image:""}                                    
                                    onChange={(e) => formik.setFieldValue('image', e.target.value)}
                                    
                                    placeholder="URL imagen"
                                />
                            </FormControl>
                        </Grid>
                        <Grid sx={{mb: 2}} item xs={12}>
                            <FormControl fullWidth size="small" sx={{mb: 2}}>
                                <TextField
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    label="Imagen pequeña 256 x 256"
                                    size="small"
                                    fullWidth
                                    required                                    
                                    defaultValue={edit?edit.smallImage:""} 
                                    helperText={touched.smallImage && errors.smallImage} 
                                    error={Boolean(touched.smallImage && errors.smallImage)} 
                                    // onChange={(e) => formik.setFieldValue('MainPhoto', e.target.value)}
                                    
                                    placeholder="Imagen pequeña 256 x 256"
                                />
                            </FormControl>
                        </Grid>
                        <Grid sx={{mb: 2}} item xs={12}>
                            <Stack spacing={3}>
                                <TextField
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    size='small'
                                    fullWidth
                                    autoComplete="description"
                                    type="text"
                                    label="Descripción"
                                    required
                                    multiline
                                    rows={2}
                                    maxRows={4}
                                    defaultValue={edit?edit.description:""} 
                                    onChange={(e) => formik.setFieldValue('description', e.target.value)}
                                    error={Boolean(touched.description && errors.description)}
                                    helperText={touched.description && errors.description}
                                />         
                            </Stack>
                        </Grid>
                    </Grid>

                    <LoadingButton
                        fullWidth
                        size="large"
                        type="submit"
                        variant="contained"
                        loading={sending}
                        color="primary"
                       /*  disabled={
                            (!permissions.crea && typeForm === "create") || 
                            (!permissions.edita && typeForm === "edit")  || 
                            (values.name === "" || values.description === "")
                        } */
                    >
                        {typeForm === "create" ? "Agregar" : "Editar"}
                    </LoadingButton>

                    </Form>
                </FormikProvider>
                    
                </RootStyle>
            </Modal>
    );
}

export default AddArticleModal;