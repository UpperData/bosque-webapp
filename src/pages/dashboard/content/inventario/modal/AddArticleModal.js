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

    const [typeForm, settypeForm]                       = useState("create");
    const [itemToEdit, setitemToEdit]                   = useState(null);

    const [alertSuccessMessage, setalertSuccessMessage] = useState("");
    const [alertErrorMessage,   setalertErrorMessage]   = useState("");

    const [sending, setsending]                         = useState(false);

    const LoginSchema =     Yup.object().shape({
        name:               Yup.string().required('Debe ingresar un nombre'),  
        description:        Yup.string().required('Debe ingresar una descripción'),
        // existence:          Yup.string().required('Ingrese stock'),
    });

    const formik = useFormik({
        validateOnChange: false,
        initialValues: {
            name:             "",
            description:      "",
            existence:        "",
        },
        validationSchema: LoginSchema,
        onSubmit: async (values, {resetForm}) => {
            try {

                let data = {
                    name:         values.name,
                    description:  values.description,
                    minStock:     values.minStock,
                    image:        values.MainPhoto,
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
                        // setalertSuccessMessage(res.data.message);
                        // setalertSuccessMessage("");
                        if(reset){
                            toast.success(res.data.message);
                            resetForm();
                            reset();
                        }

                        // setopenModalAddItem(false);
                        // getList();

                        /*
                            setTimeout(() => {
                                setalertSuccessMessage("");
                            }, 20000);
                        */
                    }

                }).catch((err) => {
                    let fetchError = err;

                    console.error(fetchError);
                    if(fetchError.response){
                        console.log(err.response);
                        setalertErrorMessage(err.response.data.data.message);
                        setTimeout(() => {
                            setalertErrorMessage("");
                        }, 20000);
                        setsending(false);
                    }
                });

            } catch(e) {
                // setformErrors(e);

                /*
                    const config = {
                        onUploadProgress: progressEvent => {
                        let progressData = progress;
                        progressData = (progressEvent.loaded / progressEvent.total) * 100;

                        console.log(progressData);

                        setprogress(progressData);
                        setcount(count + progressData);
                        }
                    }
                */
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
                        <Grid sx={{mb: 2}} item md={typeForm === "create" ? 8 : 12} xs={12}>
                            <Stack spacing={3}>
                                <TextField
                                    size='small'
                                    fullWidth
                                    autoComplete="name"
                                    type="text"
                                    label="Nombre"

                                    {...getFieldProps('name')}
                                    error={Boolean(touched.name && errors.name)}
                                    helperText={touched.name && errors.name}
                                />         
                            </Stack>
                        </Grid>
                        {typeForm === "create" &&
                            <Grid sx={{mb: 2}} item md={4} xs={12}>
                                <Stack spacing={3}>
                                    <TextField
                                        size='small'
                                        fullWidth
                                        autoComplete="Stock min."
                                        type="text"
                                        placeholder="Stock min."

                                        InputProps={{
                                            type: "number"
                                        }}

                                        {...getFieldProps('minStock')}
                                        error={Boolean(touched.minStock && errors.minStock)}
                                        helperText={touched.minStock && errors.minStock}
                                    />         
                                </Stack>
                            </Grid>
                        }
                        <Grid sx={{mb: 2}} item xs={12}>
                            <FormControl fullWidth size="small" sx={{mb: 2}}>
                                <TextField
                                    label="Url imagen"
                                    size="small"
                                    fullWidth

                                    // value={values.MainPhoto}
                                    // defaultValue={values.MainPhoto}
                                    {...getFieldProps('MainPhoto')}
                                    helperText={touched.MainPhoto && errors.MainPhoto} 
                                    error={Boolean(touched.MainPhoto && errors.MainPhoto)} 
                                    // onChange={(e) => formik.setFieldValue('MainPhoto', e.target.value)}
                                    
                                    placeholder="Url imagen"
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