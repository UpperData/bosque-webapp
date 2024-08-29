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

function AddArticleModal({ 
    show = false, 
    handleShowModal = (show) => {}, 
    reset = () => {},
    permissions = null,
    edit = null
}) {

    const urlNewItem                                    = "/INVETOry/aricle/new";
    const urlEditItem                                   = "/InVETOrY/aricLe/EdIT";
    const [isActived,setIsActived]                      =useState(false);
    const [isSUW,setIsSUW]                                =useState(false);
    const [typeForm, settypeForm]                       = useState("create");
    const [itemToEdit, setitemToEdit]                   = useState(null);

    const [alertSuccessMessage, setalertSuccessMessage] = useState("");
    const [alertErrorMessage,   setalertErrorMessage]   = useState("");

    const handleChangeStatus = () => {    
        setIsActived((prev) => !prev);
      }; 
    const handleChangeSUW  =() => {
        setIsSUW((prev) => !prev);
      };  
    const [sending, setsending]                         = useState(false);

    const LoginSchema =     Yup.object().shape({
        name:               Yup.string().required('Debe ingresar un nombre'),  
        description:        Yup.string().required('Debe ingresar una descripción'),        
        MainPhoto:          Yup.string().required('Debe ingresar URL'), 
        price:              Yup.number().required('Debe ingresar precio'), 
        minStock:           Yup.number().required('Debe ingresar stock'),
    });

    const formik = useFormik({
        validateOnChange: false,
        initialValues: {
            name:             "",
            description:      "",            
            price:            "",
            imge:             "",
            minStock:         "",
            isActived:        "",
            isSUW:            ""
        },
        validationSchema: LoginSchema,
        onSubmit: async (values, {resetForm}) => {
            try {

                let data = {
                    name:         values.name,
                    description:  values.description,
                    minStock:     values.minStock,
                    image:        values.MainPhoto,
                    price:        values.price,
                    isActived,
                    isSUW
                }

                if(typeForm === "create"){
                    data.existence = 1;
                }else{
                    data.id        = itemToEdit.id;
                }

                console.log(data);
                setsending(true);

                axios({
                    method: typeForm === "create" ? "POST" : "PUT",
                    url:    typeForm === "create" ? urlNewItem : urlEditItem,
                    data
                }).then((res) => {

                    console.log(res);
                    setsending(false);
                    
                    if(res.data.result){
                        if(reset){
                            toast.success(res.data.message);
                            resetForm();
                            reset();
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
                    <Form autoComplete="off" noValidate onSubmit={handleSubmit}>

                    <Typography id="modal-modal-title" variant="h3" component="h3">
                        {typeForm === "create" ? "Agregar un artículo" : "Editar un artículo"}
                    </Typography>

                    <Grid container sx={{ mt: 3 }} columnSpacing={3}>
                        <Grid sx={{mb: 2}} item md={typeForm === "create" ? 4 : 4} xs={4}>
                            <Stack spacing={1}>
                                <TextField
                                    size='small'
                                    fullWidth
                                    autoComplete="name"
                                    type="text"
                                    label="Nombre"
                                    required
                                    {...getFieldProps('name')}
                                    error={Boolean(touched.name && errors.name)}
                                    helperText={touched.name && errors.name}
                                />         
                            </Stack>
                        </Grid>
                        <Grid sx={{mb: 2}} item md={typeForm === "create" ? 4 : 4} xs={4}>
                            <Stack spacing={1}>
                                <TextField
                                    size='small'
                                    fullWidth
                                    autoComplete="price"
                                    type="number"
                                    label="Precio"
                                    required
                                    {...getFieldProps('price')}
                                    error={Boolean(touched.price && errors.price)}
                                    helperText={touched.price && errors.price}
                                />         
                            </Stack>
                        </Grid>
                    
                        <Grid sx={{mb: 2}} item md={4} xs={4}>
                            <Stack spacing={1}>
                                <TextField
                                    size='small'
                                    fullWidth
                                    autoComplete="Stock min."
                                    type="number"
                                    label="Stock min."
                                    required
                                    InputProps={{
                                        type: "number"
                                    }}

                                    {...getFieldProps('minStock')}
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
                                    required
                                    checked={isActived}                                           
                                />
                                }                                            
                                label={isActived ? "Activo" : "Inactivo"}
                            />  
                        </Grid>
                        <Grid item md={1}>
                            {/* Tipo de venta del producto */}
                            
                            <FormControlLabel
                                width="200"
                                control={
                                <Switch
                                    onChange={handleChangeSUW}
                                    name="isSUW"
                                    color="primary" 
                                    checked={isSUW}
                                    required                                               
                                />
                                }                                            
                                 label={isSUW ? "VUP" : "VP"}
                                // label={`Switch is ${isSUW? 'ON':'OFF'}`}
                            />  
                        </Grid>
                        <Grid sx={{mb: 2}} item xs={12}>
                            <FormControl fullWidth size="small" sx={{mb: 2}}>
                                <TextField
                                    label="URL imagen"
                                    size="small"
                                    fullWidth
                                    required
                                    // value={values.MainPhoto}
                                    // defaultValue={values.MainPhoto}
                                    {...getFieldProps('MainPhoto')}
                                    helperText={touched.MainPhoto && errors.MainPhoto} 
                                    error={Boolean(touched.MainPhoto && errors.MainPhoto)} 
                                    // onChange={(e) => formik.setFieldValue('MainPhoto', e.target.value)}
                                    
                                    placeholder="URL imagen"
                                />
                            </FormControl>
                        </Grid>
                        <Grid sx={{mb: 2}} item xs={12}>
                            <Stack spacing={3}>
                                <TextField
                                    size='small'
                                    fullWidth
                                    autoComplete="description"
                                    type="text"
                                    label="Descripción"
                                    required
                                    multiline
                                    rows={2}
                                    maxRows={4}

                                    {...getFieldProps('description')}
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
                        disabled={
                            (!permissions.crea && typeForm === "create") || 
                            (!permissions.edita && typeForm === "edit")  || 
                            (values.name === "" || values.description === "")
                        }
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