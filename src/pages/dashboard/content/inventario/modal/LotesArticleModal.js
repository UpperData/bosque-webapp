import React, {useEffect, useState} from 'react'
import AddLotModal from "./AddLotModal";
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
    FormHelperText,
    Switch,
    FormControlLabel 
} from '@mui/material';
import { DataGrid, DataGridProps } from '@mui/x-data-grid';
import { LoadingButton } from '@mui/lab';
import { alpha, styled } from '@mui/material/styles';

import * as Yup from 'yup';
import { useFormik, Form, FormikProvider } from 'formik';
import moment from "moment";

import axios from "../../../../../auth/fetch"
import Loader from '../../../../../components/Loader/Loader';
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
function formatDate(date) {
     let d = new Date(date);
     let month = '' + (d.getMonth() + 1);
     let day = '' + d.getDate();
     let year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return [year, month, day].join('-');
}
function LotesArticleModal({ 
    show = false, 
    handleShowModal = (show) => {}, 
    reset = () => {}, 
    edit = null ,
    permissions= null
}) {
    let items=[]  ;    
    function getList(){
        // setId(id + 1);
        items.push({"id": id , "lote":47,"weight":values.weight,"condition":values.condition,"note":values.note});
        // setList(items); 
        console.log(list);               
    }
    
    const [list, setList] = useState([]);
    const [id, setId] = useState(null);
    const [exp,setExp] =useState(null)
    const [loading, setloading] = useState(true);
    const [sending, setsending] = useState(false);
    const [usersList, setusersList] = useState([]);
    const [weight,setWeight]=useState(0);
    const [condition,setCondition]=useState(1);
    const [note,setnote]=useState(null);
    const [articlesList, setarticlesList] = useState([]);
    const [articlesLots, setArticlesLots] = useState([]);
    const [currentLot,setCurrentLot] = useState([]);
    const [lotId,setLotId] =useState(0);
    const [currenItem,setCurrenItem] =useState(0);
    

    const [showAddLotModal, setshowAddLotModal] = useState(false);
  
    const getItems = () => {
        const url = '/InVETorY/aRIcLe/list/*';

        axios.get(url).then((res) => {
             
            if(res.data.result){
                setarticlesList(res.data.data);
            }            
        }).catch((err) => {
            console.error(err);
        });
    }
    const getLots = () => {
        
        const url = '/inVenTory/LotS/'+edit.id+'/*';
        axios.get(url).then((res) => {           
            if(res.data.result){
                setArticlesLots(res.data.data);        
            }else{
                setArticlesLots([]);                
            }
        }).catch((err) => {
            console.error(err);
        });
    }
    const getCurrentLot = () => {        
        if(lotId>0){
            setCurrentLot(articlesLots.find(x => x.id===lotId)) 
            
        }else{
            setCurrentLot([{}]);
        }
    }
    useEffect(() => { 
        if(lotId>0) getCurrentLot();
    },[lotId]);

    useEffect(() => {               
        if(loading){
             getItems();
            if(edit && articlesLots)getLots();            
        }
    },[]);
  
    const openAddLotModal = () => {
        setshowAddLotModal(true);        
    }

    const resetModalAddItem = () => { // recarga modal padre
        setshowAddLotModal(false);
        getItems();
        // getLots();
        // setLotId(0);
    }

    const FormSchema =      Yup.object().shape({
        articleId:              Yup.string().trim().required('Campo requerido'),
        existence:              Yup.string().trim().required('Campo requerido'),
        description:            Yup.string().trim().required('Campo requerido')
    });
// encabezado del lote

    const formik = useFormik({
        enableReinitialize: true,
        validateOnChange: false,
        initialValues: {
            weight:      "",
            conditionId: "",
            note:        ""
        } ,
        // validationSchema: FormSchema,
        onSubmit: async (values) => {
            let data = {
                lotId,
                items:[{        
                    "weight":values.weight,
                    "conditionId":values.conditionId,
                    "note":values.note
                }]
            }
            setsending(true);            
            axios({
                method: currenItem === 0 ? "POST" : "PUT",
                url:    '/inVenTory/LotS/ITEMS',
                data
            }).then((res) => {
                toast.success(res.data.message);
                setsending(false);
                
                
            }).catch((err) => {
                console.error(err);
            });
        }
    });
    const formikItem = useFormik({
        enableReinitialize: true,
        validateOnChange: false,
        initialValues: {
            weight:      "",
            conditionId: "",
            note:        ""
        } ,
        // validationSchema: FormSchema,
        onSubmit: async (values) => {
            let data = {
                lotId,
                items:[{        
                    "weight":values.weight,
                    "conditionId":values.conditionId,
                    "note":values.note
                }]
            }
            setsending(true);            
            axios({
                method: currenItem === 0 ? "POST" : "PUT",
                url:    '/inVenTory/LotS/ITEMS',
                data
            }).then((res) => {
                toast.success(res.data.message);
                setsending(false);
                
                
            }).catch((err) => {
                console.error(err);
            });
        }
    });
    const { errors, touched, values, isSubmitting, handleSubmit, getFieldProps, setFieldValue, resetForm } = formik;  
    
    const [state, setState] = React.useState({
        checkedA: true,
        checkedB: true,
    });
    const handleChange = (event) => {
        setState({ ...state, [event.target.name]: event.target.checked });
      };      
    
    const columns  = [    
    {         
        field: 'id',     
        headerName: '# Item',
        maxWidth: 80,
        minWidth: 60,
        flex: 1,
        sortable: false,
        renderCell: (cellValues) => {/*
            let data = currentLot.itemLots;
            console.log(data)
           return  <Typography 
                        sx={{
                            fontWeight: 'bold', 
                            mb:0, 
                            justifyContent: "start"
                        }} 
                        fullWidth 
                        variant="body"
                        // onClick={() => editItem(data.row)}
                    >
                        { data.id}
                    </Typography> */
        }
    },{ 
        editable: true,
        field: 'weight',     
        headerName: 'Peso',
        maxWidth: 100,
        minWidth: 80,
        flex: 1,
        sortable: false,
        renderCell: (cellValues) => {/*
            let data = currentLot.itemLots;
            
            return  <Typography 
                        sx={{
                            fontWeight: 'bold', 
                            mb:0, 
                            justifyContent: "start"
                        }} 
                        fullWidth 
                        variant="body"
                        // onClick={() => editItem(data.row)}
                    >
                        {data.weight} 
                    </Typography> */
        }
    },{ 
        editable: false,
        field: 'conditionName',     
        headerName: 'Condición',
        maxWidth: 200,
        minWidth: 100,
        flex: 1,
        sortable: false,         
        renderCell: (cellValues) => { /*
            const innerNotes = JSON.parse(currentLot.itemLots?.condition);            
            let data = currentLot.itemLots;            
            return  <Typography 
                        sx={{
                            fontWeight: 'bold', 
                            mb:0, 
                            justifyContent: "start"
                        }} 
                        fullWidth 
                        variant="body"
                        // onClick={() => editItem(data.row)}
                    >
                        {innerNotes.name} 
                    </Typography>  */
        }
    },{ 
        editable: true,
        field: 'note',     
        headerName: 'Nota',
        maxWidth: 150,
        minWidth: 80,
        flex: 1,
        sortable: false,
        renderCell: (cellValues) => { /*
            let data = currentLot.itemLots;
            
            return  <Typography 
                sx={{
                    fontWeight: 'bold', 
                    mb:0, 
                    justifyContent: "start"
                }} 
                fullWidth 
                variant="body"
                // onClick={() => editItem(data.row)}
                >
                    {data.note} 
                </Typography>   */
        }
    }
    ]
    
    return (
        <>
            
            <AddLotModal 
                show={showAddLotModal}
                handleShowModal={(show) => {
                    setshowAddLotModal(false);
                }}
                permissions={permissions}
                reset={() => resetModalAddItem()}
                article={edit}
                lotId={0}
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
                        {!edit ? 'Agregar Lote' : 'Lotes de '+ edit.name}
                    </Typography>
                    
                    {/* articulo select */}
                    
                        <Grid container columnSpacing={3}>
                            {!edit && <Grid item md={5} xs={12}>

                                <FormControl fullWidth size="small" sx={{mb: 2}} error={Boolean(touched.articleId && errors.articleId)} >
                                    <InputLabel id="article-label">
                                        Artículo
                                    </InputLabel>
                                    <Select
                                        fullWidth
                                        labelId="article-label"
                                        id="article"

                                        value={values.articleId}
                                        onChange={(e) => formik.setarticlesList(e.target.value)}                                        
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
                           </Grid>}
                            <Grid item md={6} xs={12}>

                                <FormControl fullWidth size="small" sx={{mb: 2}} error={Boolean(touched.articleId && errors.articleId)} >
                                    <InputLabel id="article-label">
                                        Lotes
                                    </InputLabel>
                                    <Select
                                        fullWidth
                                        labelId="article-label"
                                        id="lots"
                                        onChange={(e) => setLotId(e.target.value)}                                        
                                        label="Lotes"
                                        MenuProps={MenuProps}
                                    >
                                        {articlesLots.map((item, key) => {
                                            let dataItem = item;
                                            return <MenuItem 
                                                key={key} 
                                                value={dataItem.id}
                                            >
                                                {
                                                    
                                                    dataItem.id +  " - " + new Intl.DateTimeFormat('es-VE').format(new Date(dataItem.receivedDate)) 
                                                
                                                }
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
                            <Grid item md={4} xs={4}>
                                <Tooltip title="Crear un nuevo lote" placement="top-start">
                                    <Button
                                        id="newLot"
                                        sx={{mb: 2}}
                                        variant="contained"
                                        component="label"
                                        fullWidth
                                        
                                        // onClick={() => openAddArticleModal()}
                                        onClick={() => openAddLotModal(edit)}
                                    >
                                        Nuevo Lote
                                    </Button>
                                </Tooltip>
                            </Grid>
                        </Grid>
                    

                    {/* data inventario */}
                    <Grid container columnSpacing={3}>
                        <Grid item md={12} xs={12}>

                            <Grid container columnSpacing={2}>
                                <Grid item md={2}>
                                    {/* codigo */}
                                    <FormControl fullWidth size="small" sx={{mb: 2}}>
                                        <TextField
                                        InputLabelProps={{
                                            shrink: true,
                                          }}
                                            label="Cód. Artículo"
                                            size="small"
                                            fullWidth
                                            InputProps={{
                                                readOnly: true,
                                            }}
                                            value={currentLot.articleId}
                                            // defaultValue={values.description}

                                            // helperText={touched.description && errors.description} 
                                            // error={Boolean(touched.description && errors.description)} 
                                            // onChange={(e) => formik.setFieldValue('description', e.target.value)}
                                            
                                            // placeholder="Nombre del grupo"
                                            // value={nameNewGroup}
                                            // onChange={(e) => setnameNewGroup(e.target.value)}
                                            readOnly
                                        />
                                    </FormControl>  
                                </Grid>     
                                <Grid item md={2}>
                                    <FormControl fullWidth size="small" sx={{mb: 2}}>
                                        <TextField
                                        InputLabelProps={{
                                            shrink: true,
                                          }}
                                            label="# Lote"
                                            size="small"
                                            fullWidth
                                            InputProps={{
                                                readOnly: true,
                                            }}
                                            value={currentLot.id}
                                            // defaultValue={values.description}

                                            // helperText={touched.description && errors.description} 
                                            // error={Boolean(touched.description && errors.description)} 
                                            // onChange={(e) => formik.setFieldValue('description', e.target.value)}
                                            
                                            // placeholder="Nombre del grupo"
                                            // value={nameNewGroup}
                                            // onChange={(e) => setnameNewGroup(e.target.value)}
                                            readOnly
                                        />
                                    </FormControl>   
                                </Grid>
                                <Grid item md={2}>
                                    {/* existencia */}
                                    <FormControl fullWidth size="small" sx={{mb: 2}}>
                                        <TextField
                                        InputLabelProps={{
                                            shrink: true,
                                          }}
                                            label="Cantidad"
                                            type="number"
                                            size="small"
                                            fullWidth                                            
                                            value={ Object.keys(currentLot.itemLots || {} ).length  }
                                            helperText={touched.qty && errors.qty} 
                                            error={Boolean(touched.qty && errors.qty)} 
                                            onChange={(e) => formik.setFieldValue('existence', e.target.value)}
                                            readOnly
                                            placeholder="Cantidad"
                                        /> 
                                    </FormControl>    
                                </Grid>
                                <Grid item md={3}>
                                    {/* existencia */}
                                    <FormControl fullWidth size="small" sx={{mb: 2}}>
                                        <TextField
                                            InputLabelProps={{
                                                shrink: true,
                                              }}
                                            label="Recibido"
                                            type="date"
                                            size="small"
                                            fullWidth
                                            value={formatDate( currentLot.receivedDate) }                     
                                            // helperText={touched.existence && errors.existence} 
                                            error={Boolean(touched.existence && errors.existence)} 
                                            onChange={(e) => formik.setFieldValue('existence', e.target.value)}                                            
                                            placeholder="Recibido"
                                            readOnly
                                        /> 
                                    </FormControl>    
                                </Grid>
                                <Grid item md={3}>
                                    {/* existencia */}
                                    <FormControl fullWidth size="small" sx={{mb: 2}}>
                                        <TextField
                                            InputLabelProps={{
                                                shrink: true,
                                              }}
                                            label="Vencimiento"
                                            type="date"
                                            size="small"
                                            fullWidth
                                            value={formatDate(currentLot.expDate)}                     
                                            defaultValue={values.exp}
                                            // helperText={touched.existence && errors.existence} 
                                            error={Boolean(touched.exp && errors.exp)} 
                                            onChange={(e) => formik.setFieldValue('exp', e.target.value)}                                            
                                            placeholder="Vencimiento"
                                            readOnly
                                        /> 
                                    </FormControl>    
                                </Grid>                                
                                <Grid item md={3}>
                                    {/* estatus del lote */}
                                    
                                    <FormControlLabel
                                        width="200"
                                        control={
                                        <Switch
                                            checked={currentLot.isActived}
                                            onChange={handleChange}
                                            name="isActived"
                                            color="primary"
                                            readOnly
                                        />
                                        }
                                        
                                        label={currentLot.isActived ? "Activo" : "Inactivo"}
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
                                        value={currentLot.note}
                                        defaultValue={currentLot.note}
                                        helperText={touched.description && errors.description} 
                                        error={Boolean(touched.description && errors.description)} 
                                        onChange={(e) => formik.setFieldValue('description', e.target.value)}                                        
                                        placeholder="Nota relevante"
                                        readOnly
                                    />
                                    </FormControl>
                                </Grid>                               
                            </Grid>

                            
                            {/*
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
                            */}
                            
                        </Grid>
                        
                    </Grid>   
                    <hr/>  
                    <br/>
                    <FormikProvider value={formik}>
                        <Form autoComplete="off" noValidate onSubmit={handleSubmit } id="form1">
                            <Grid container columnSpacing={3}>  
                                <Grid item md={12} xs={12}>
                                    <Grid container columnSpacing={2}>
                                        <Grid item md={3}>
                                            {/* peso */}
                                            <FormControl fullWidth size="small" sx={{mb: 2}}>
                                                <Tooltip title="Peso de item" placement="top-end">
                                                    <TextField
                                                        label="Peso"
                                                        size="small"
                                                        fullWidth
                                                        type="number"
                                                        InputLabelProps={{
                                                            shrink: true,
                                                        }}
                                                        // value={values.articleId}
                                                        placeholder="Kg"
                                                        helperText={touched.weight && errors.weight} 
                                                        error={Boolean(touched.weight && errors.weight)} 
                                                        onChange={(e) => formik.setFieldValue('weight', e.target.value)}
                                                    />
                                                </Tooltip>
                                            </FormControl>    
                                        </Grid>
                                        <Grid item md={3}>
                                            {/* codigo */}
                                            <FormControl fullWidth size="small" sx={{mb: 2}}>
                                                <InputLabel id="demo-simple-select-label">Condición</InputLabel>
                                                <Tooltip title="Condición del Item" placement="top-end">
                                                    <Select
                                                        labelId="demo-simple-select-label"
                                                        id="demo-simple-select"
                                                        defaultValue={1}
                                                        label="Condición"
                                                        onChange={(e) => formik.setFieldValue('conditionId', e.target.value)}
                                                    >
                                                        <MenuItem value={1}>Disponible </MenuItem>
                                                        <MenuItem value={2}>Reservado</MenuItem>
                                                        <MenuItem value={3}>Vendido</MenuItem>
                                                        <MenuItem value={4}>Eliminado</MenuItem>
                                                    </Select>
                                                </Tooltip>
                                            </FormControl>    
                                        </Grid>
                                        <Grid item md={3}>
                                            {/* nota */}
                                            <FormControl fullWidth size="small" sx={{mb: 2}}>
                                                <Tooltip title="Nota u observación" placement="top-end">  
                                                    <TextField
                                                        label="Nota"
                                                        size="small"
                                                        // defaultValue="N/A"
                                                        fullWidth
                                                        placeholder="N/A"
                                                        InputLabelProps={{
                                                            shrink: true,
                                                        }}
                                                        // value={values.articleId}
                                                        onChange={(e) => formik.setFieldValue('note', e.target.value)}
                                                    />
                                                </Tooltip>
                                            </FormControl>    
                                        </Grid>
                                    <Grid item md={2} xs={2}>
                                        <Tooltip title="Agregar Item al lote" placement="top-end">
                                            <LoadingButton                                                
                                                fullWidth
                                                size="large"
                                                type="submit"
                                                variant="contained"
                                                
                                                color="primary"
                                                form="form1"                                              
                                            >
                                                +
                                            </LoadingButton>
                                        </Tooltip>
                                    </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>     
                        </Form>
                    </FormikProvider>
                    <div style={{display: 'table', tableLayout:'fixed', width:'100%'}}>                         
                        <DataGrid autoHeight 
                            sx={{mb:6}}
                            rows={currentLot.itemLots}
                            columns={columns}
                            rowHeight={23}
                            // onCellEditStop={(params) => handleCellEditStop(params)}
                            // experimentalFeatures={{ newEditingApi: true }}
                            // onCellEditStart={(params) => handleCellEditStart(params)}
                            // processRowUpdate={processRowUpdate}

                            // onCellEditCommit={(params) => handleCellEditStop(params)}
                            // onCellFocusOut={(params)   => validateChanges(params)}
                            
                            // page={0}
                            pageSize={6}
                            rowsPerPageOptions={[6,10,20]}
                            // autoPageSize
                            rowCount={Object.keys(currentLot.itemLots || {} ).length}

                            // disableColumnFilter
                            // disableColumnMenu                            
                            disableColumnSelector
                            disableSelectionOnClick
                            editable
                            // checkboxSelection
                        />

                    </div>                                     
                </RootStyle>
            </Modal>
        </>
    )
}

export default LotesArticleModal;