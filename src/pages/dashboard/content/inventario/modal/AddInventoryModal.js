import React, {useEffect, useState} from 'react'
import AddArticleModal from "./AddArticleModal";
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
    Select,
    TextField, 
    Checkbox, 
    MenuItem, 
    InputLabel, 
    FormControl,
    FormHelperText
} from '@mui/material';

import { LoadingButton } from '@mui/lab';
import { alpha, styled } from '@mui/material/styles';

import * as Yup from 'yup';
import { useFormik, Form, FormikProvider } from 'formik';
import moment from "moment";

import axios from "../../../../../auth/fetch"
import Loader from '../../../../../components/Loader/Loader';
import CategorySelect from '../../../../../components/selects/Category';
import ClaseSelect from '../../../../../components/selects/Clase';
import AnioSelect from '../../../../../components/selects/Anio';
import MarcaSelect from '../../../../../components/selects/Marca';
import ModelSelect from '../../../../../components/selects/Models';
import SubCategorySelect from '../../../../../components/selects/SubCategory';
import UploaderProductImg from '../../rrhh/Components/UploaderProductImages';
import { toast } from 'react-toastify';


const RootStyle = styled(Card)(({ theme }) => ({
    boxShadow: 'none',
    textAlign: 'center',
    padding: theme.spacing(5, 5),
    width: "95%",
    margin: "auto",
    maxWidth: "770px",
    maxHeight: "90vh",
    overflowY: "auto",
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

function AddInventoryModal({ 
    show = false, 
    handleShowModal = (show) => {}, 
    reset = () => {}, 
    edit = null ,
    permissions= null
}) {

    const [loading, setloading] = useState(true);
    const [sending, setsending] = useState(false);
    const [usersList, setusersList] = useState([]);

    const [articlesList, setarticlesList] = useState([]);

    const [showAddArticleModal, setshowAddArticleModal] = useState(false);

    const getItems = () => {
        const url = '/InVETorY/aRIcLe/list/*';

        axios.get(url).then((res) => {
            console.log(res.data);
            if(res.data.result){
                setarticlesList(res.data.data);
            }
        }).catch((err) => {
            console.error(err);
        });
    }

    useEffect(() => {
        if(loading){
            getItems();
        }
    }, []);

    const openAddArticleModal = () => {
        setshowAddArticleModal(true);
    }

    const resetModalAddItem = () => {
        setshowAddArticleModal(false);
        getItems();
    }

    const FormSchema =      Yup.object().shape({
        articleId:              Yup.string().trim().required('Campo requerido'),

        existence:              Yup.string().trim().required('Campo requerido'),
        minSctock:              Yup.string().trim().required('Campo requerido'),

        price:                  Yup.number().required('Campo requerido'),
        sku:                    Yup.string().trim().required('Campo requerido'),
        autoTypeId:             Yup.string().trim().required('Campo requerido'),

        categoryId:             Yup.string().trim().required('Campo requerido'),
        

        yearId:                 Yup.string().trim().required('Campo requerido'),
        brandId:                Yup.string().trim().required('Campo requerido'),
        modelId:                Yup.string().trim().required('Campo requerido'),

        description:            Yup.string().trim().required('Campo requerido'),
        MainPhoto:              Yup.string().trim().required('Campo requerido').url('Ingrese una URL válida'),
    });

    const formik = useFormik({
        enableReinitialize: true,
        validateOnChange: false,
        initialValues: !edit ? {
            articleId:          "",
            existence:          "",
            minSctock:          "",

            price:              "",
            sku:                "",

            autoTypeId:         "",
            
            // category
            categoryId:         "",
            subCategory:        "",

            yearId:             "",
            brandId:            "",
            modelId:            "",

            description:        "",

            MainPhoto:          "",
            secondPhoto:        "",
            thirdPhoto:         "",

            // photo:           []
        } : {
            articleId:          edit.articleId,
            existence:          edit.existence,
            minSctock:          edit.minStock ? edit.minStock : "",

            price:              edit.price,
            sku:                edit.sku ? edit.sku : "",

            autoTypeId:         edit.autoTypeId ? edit.autoTypeId : "",
            
            // category
            categoryId:         edit.category ? edit.category.categoryId  : "",
            subCategory:        edit.category ? edit.category.subCategory : "",

            yearId:             edit.filter ? edit.filter.yearId  : "",
            brandId:            edit.filter ? edit.filter.brandId : "",
            modelId:            edit.filter ? edit.filter.modelId : "",

            description:        edit.description ? edit.description : "",

            MainPhoto:          edit.photo ? edit.photo.MainPhoto   : "",
            secondPhoto:        edit.photo ? edit.photo.secondPhoto : "",
            thirdPhoto:         edit.photo ? edit.photo.thirdPhoto  : "",
        },
        validationSchema: FormSchema,
        onSubmit: async (values, {resetForm}) => {
            let data = {
                articleId:       values.articleId,
                existence:       values.existence,
                minSctock:       values.minSctock,

                price:           values.price,
                sku:             values.sku,
                autoTypeId:      values.autoTypeId,
                
                // category
                category:           {
                    categoryId:  values.categoryId,
                    subCategory: values.subCategory,
                },

                filter:             {
                    yearId:    values.yearId,
                    brandId:   values.brandId,
                    modelId:   values.modelId,
                },

                description:        values.description,
                tags:               "car",
                photo:              {
                    MainPhoto: values.MainPhoto && values.MainPhoto !== "" ? values.MainPhoto : null,
                    secondPhoto: values.secondPhoto && values.secondPhoto !== "" ? values.secondPhoto : null,
                    thirdPhoto: values.thirdPhoto && values.thirdPhoto !== "" ? values.thirdPhoto : null
                }
            }

            setsending(true);

            console.log('data', data);
            axios.put('/InvEToRY/UpdaTE/ARTICLE', data).then((res) => {

                console.log(res.data);
                toast.success(res.data.message);
                setsending(false);
                reset();
                
            }).catch((err) => {
                console.error(err);
            });
        }
    });

    const { errors, touched, values, isSubmitting, handleSubmit, getFieldProps, setFieldValue, resetForm } = formik;
    console.log(values);
    console.log(edit);

    return (
        <>
            <AddArticleModal 
                show={showAddArticleModal}
                handleShowModal={(show) => {
                    setshowAddArticleModal(false);
                }}
                permissions={permissions}
                reset={() => resetModalAddItem()}
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
                <RootStyle>
                    <Typography id="modal-modal-title" variant="h4" component="h4" sx={{mb: 3}}>
                        {!edit ? 'Agregar inventario' : 'Editar inventario'}
                    </Typography>

                    {/* articulo select */}
                    {!edit &&
                        <Grid container columnSpacing={3}>
                            <Grid item md={7} xs={12}>

                                <FormControl fullWidth size="small" sx={{mb: 2}} error={Boolean(touched.articleId && errors.articleId)} >
                                    <InputLabel id="article-label">
                                        Artículo
                                    </InputLabel>
                                    <Select
                                        fullWidth
                                        labelId="article-label"
                                        id="article"

                                        value={values.articleId}
                                        onChange={(e) => formik.setFieldValue('articleId', e.target.value)}
                                        
                                        label="Artículo"
                                        MenuProps={MenuProps}
                                    >
                                        {articlesList.map((item, key) => {
                                            let dataItem = item;
                                            return <MenuItem 
                                                key={key} 
                                                value={dataItem.id}
                                            >
                                                {dataItem.name}
                                            </MenuItem>
                                        })}
                                    </Select>
                                    {touched.articleId && errors.articleId &&
                                        <FormHelperText>
                                            {errors.articleId}
                                        </FormHelperText>
                                    }
                                </FormControl>
                            </Grid>
                            <Grid item md={5} xs={12}>
                                <Button
                                    sx={{mb: 2}}
                                    variant="contained"
                                    component="label"
                                    fullWidth
                                    onClick={() => openAddArticleModal()}
                                >
                                    Agregar artículo
                                </Button>
                            </Grid>
                        </Grid>
                    }

                    {/* data inventario */}
                    <Grid container columnSpacing={3}>
                        <Grid item md={7} xs={12}>

                            <Grid container columnSpacing={1}>
                                <Grid item md={6}>
                                    {/* codigo */}
                                    <FormControl fullWidth size="small" sx={{mb: 2}}>
                                        <TextField
                                            label="Código"
                                            size="small"
                                            fullWidth
                                            InputProps={{
                                                readOnly: true,
                                            }}
                                            value={values.articleId}
                                            // defaultValue={values.description}

                                            // helperText={touched.description && errors.description} 
                                            // error={Boolean(touched.description && errors.description)} 
                                            // onChange={(e) => formik.setFieldValue('description', e.target.value)}
                                            
                                            // placeholder="Nombre del grupo"
                                            // value={nameNewGroup}
                                            // onChange={(e) => setnameNewGroup(e.target.value)}
                                            disabled
                                        />
                                    </FormControl>    
                                </Grid>
                                <Grid item md={6}>
                                    {/* existencia */}
                                    <FormControl fullWidth size="small" sx={{mb: 2}}>
                                        <TextField
                                            label="Existencia"
                                            type="number"
                                            size="small"
                                            fullWidth

                                            value={values.existence}
                                            defaultValue={values.existence}

                                            helperText={touched.existence && errors.existence} 
                                            error={Boolean(touched.existence && errors.existence)} 
                                            onChange={(e) => formik.setFieldValue('existence', e.target.value)}
                                            
                                            placeholder="Stock min"
                                        />
                                    </FormControl>    
                                </Grid>
                                <Grid item md={4}>
                                    {/* Stock min */}
                                    <FormControl fullWidth size="small" sx={{mb: 2}}>
                                        <TextField
                                            label="Stock min"
                                            type="number"
                                            size="small"
                                            fullWidth

                                            value={values.minSctock}
                                            defaultValue={values.minSctock}

                                            helperText={touched.minSctock && errors.minSctock} 
                                            error={Boolean(touched.minSctock && errors.minSctock)} 
                                            onChange={(e) => formik.setFieldValue('minSctock', e.target.value)}
                                            
                                            placeholder="Stock min"
                                        />
                                    </FormControl>    
                                </Grid>
                                <Grid item md={4}>
                                    {/* Precio */}
                                    <FormControl fullWidth size="small" sx={{mb: 2}}>
                                        <TextField
                                            label="Precio"
                                            size="small"
                                            type='number'
                                            fullWidth

                                            value={values.price}
                                            defaultValue={values.price}

                                            helperText={touched.price && errors.price} 
                                            error={Boolean(touched.price && errors.price)} 
                                            onChange={(e) => formik.setFieldValue('price', e.target.value)}
                                            
                                            placeholder="Stock min"
                                        />
                                    </FormControl>    
                                </Grid>
                                <Grid item md={4}>
                                    {/* SKU */}
                                    <FormControl fullWidth size="small" sx={{mb: 2}}>
                                        <TextField
                                            label="SKU"
                                            size="small"
                                            fullWidth

                                            value={values.sku}
                                            defaultValue={values.sku}

                                            helperText={touched.sku && errors.sku} 
                                            error={Boolean(touched.sku && errors.sku)} 
                                            onChange={(e) => formik.setFieldValue('sku', e.target.value)}
                                            
                                            placeholder="SKU"
                                        />
                                    </FormControl>    
                                </Grid>
                            </Grid>

                            <FormControl fullWidth size="small" sx={{mb: 2}}>
                                {/* Descripción */}
                                <TextField
                                    label="Descripción"
                                    size="small"
                                    fullWidth
                                    minRows={3}
                                    multiline

                                    value={values.description}
                                    defaultValue={values.description}

                                    helperText={touched.description && errors.description} 
                                    error={Boolean(touched.description && errors.description)} 
                                    onChange={(e) => formik.setFieldValue('description', e.target.value)}
                                    
                                    placeholder="Stock min"
                                />
                            </FormControl>

                            <Typography 
                                id="modal-modal-title" 
                                color='text.secondary' 
                                align='left' 
                                variant="h6" 
                                component="h6" 
                                sx={{mb: 2}}
                            >
                                Categoría
                            </Typography>

                            <Grid container columnSpacing={1}>
                                <Grid item md={4} sx={{mb: 2}}>
                                    <ClaseSelect 
                                        value={values.autoTypeId}
                                        onChange={(val) => setFieldValue('autoTypeId', val)}
                                        helperText={touched.autoTypeId && errors.autoTypeId} 
                                        error={Boolean(touched.autoTypeId && errors.autoTypeId)} 
                                    />
                                </Grid>
                                <Grid item md={4} sx={{mb: 2}}>
                                    <CategorySelect 
                                        id={values.autoTypeId}
                                        value={values.categoryId}
                                        onChange={(val) => setFieldValue('categoryId', val)}
                                        helperText={touched.categoryId && errors.categoryId} 
                                        error={Boolean(touched.categoryId && errors.categoryId)}
                                    />
                                </Grid>
                                <Grid item md={4} sx={{mb: 2}}>
                                    <SubCategorySelect 
                                        id={values.categoryId}
                                        value={values.subCategory}
                                        onChange={(val) => setFieldValue('subCategory', val)}
                                        helperText={touched.subCategory && errors.subCategory} 
                                        error={Boolean(touched.subCategory && errors.subCategory)} 
                                    />
                                </Grid>
                                <Grid item md={4} sx={{mb: 2}}>
                                    <AnioSelect 
                                        value={values.yearId}
                                        onChange={(val) => setFieldValue('yearId', val)}
                                        helperText={touched.yearId && errors.yearId} 
                                        error={Boolean(touched.yearId && errors.yearId)} 
                                    />
                                </Grid>
                                <Grid item md={4} sx={{mb: 2}}>
                                    <MarcaSelect 
                                        value={values.brandId}
                                        onChange={(val) => setFieldValue('brandId', val)}
                                        helperText={touched.brandId && errors.brandId} 
                                        error={Boolean(touched.brandId && errors.brandId)} 
                                    />
                                </Grid>
                                <Grid item md={4} sx={{mb: 2}}>
                                    <ModelSelect 
                                        id={values.brandId}
                                        value={values.modelId}
                                        onChange={(val) => setFieldValue('modelId', val)}
                                        helperText={touched.modelId && errors.modelId} 
                                        error={Boolean(touched.modelId && errors.modelId)} 
                                    />
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item md={5} xs={12}>
                            <Box sx={{width: '100%', textAlign: 'left'}}>
                                <Typography 
                                    color='text.secondary' 
                                    id="modal-modal-title" 
                                    variant="h6" 
                                    component="h6"  
                                    sx={{mb: 2}}
                                >
                                    Imagenes
                                </Typography>
                                <FormControl fullWidth size="small" sx={{mb: 2}}>
                                    <TextField
                                        label="Url imagen principal"
                                        size="small"
                                        fullWidth

                                        value={values.MainPhoto}
                                        defaultValue={values.MainPhoto}

                                        helperText={touched.MainPhoto && errors.MainPhoto} 
                                        error={Boolean(touched.MainPhoto && errors.MainPhoto)} 
                                        onChange={(e) => formik.setFieldValue('MainPhoto', e.target.value)}
                                        
                                        placeholder="Url imagen principal"
                                    />
                                </FormControl> 
                                <FormControl fullWidth size="small" sx={{mb: 2}}>
                                    <TextField
                                        label="Url imagen 2"
                                        size="small"
                                        fullWidth

                                        value={values.secondPhoto}
                                        defaultValue={values.secondPhoto}

                                        helperText={touched.secondPhoto && errors.secondPhoto} 
                                        error={Boolean(touched.secondPhoto && errors.secondPhoto)} 
                                        onChange={(e) => formik.setFieldValue('secondPhoto', e.target.value)}
                                        
                                        placeholder="Url imagen 2"
                                    />
                                </FormControl>
                                <FormControl fullWidth size="small" sx={{mb: 2}}>
                                    <TextField
                                        label="Url imagen 3"
                                        size="small"
                                        fullWidth

                                        value={values.thirdPhoto}
                                        defaultValue={values.thirdPhoto}

                                        helperText={touched.thirdPhoto && errors.thirdPhoto} 
                                        error={Boolean(touched.thirdPhoto && errors.thirdPhoto)} 
                                        onChange={(e) => formik.setFieldValue('thirdPhoto', e.target.value)}
                                        
                                        placeholder="Url imagen 3"
                                    />
                                </FormControl>
                            </Box>
                        </Grid>
                    </Grid>           

                    <Box flex justifyContent="center" sx={{mt: 2}}>
                        <LoadingButton 
                            variant="contained" 
                            color="primary"
                            type="submit"
                            sx={{px: 2.5, py: 1.5}}
                            onClick={() => handleSubmit()}
                            loading={sending}
                            disabled={sending}
                        >
                            {!edit ? 'Guardar' : 'Editar'}
                        </LoadingButton>
                        <Button 
                            disabled={sending} 
                            size="large" 
                            sx={{px: 2.5 , mx: 1 }} 
                            onClick={() => handleShowModal(false)}
                        >
                            Cancelar
                        </Button>
                    </Box>
                </RootStyle>
            </Modal>
        </>
    )
}

export default AddInventoryModal;