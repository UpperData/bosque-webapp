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
import { toast } from 'react-toastify';
import AddItemModal from './AddItemModal';

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

function ItemLotManger({ 
    show = false, 
    handleShowModal = (show) => {}, 
    reset = () => {},    
    articleName = null,
    permissions=null,
    lot=null
}) {
   
    const urlLots                                    = "/inVenTory/LOTS";
    const [typeForm, settypeForm]                       = useState("create");
    const [itemToEdit, setitemToEdit]                   = useState(null);    
    const [alertErrorMessage,   setalertErrorMessage]   = useState("");
    const [isActived,setIsActived]=useState(true);
    const [sending, setsending]                         = useState(false);
    const [itemLots, setItemLots]                       = useState(false);
    const [showAddItemModal,setShowAddItemModal]        =useState(false); 
    const [currentItem, setCurrentItem]                 = useState([]);

    const openAddItemModal = (row) => {
        row.name=lot.name;
        setCurrentItem(row);
        setShowAddItemModal(true);        
        console.log("Item actual");
        console.log(row);
    }
    const LoginSchema =     Yup.object().shape({
        name:               Yup.string().required('Debe ingresar un nombre'),  
        description:        Yup.string().required('Debe ingresar una descripción'),        
    });
     
    const getCurrentItem = () => {        
        if(currentItem.id>0){
            setCurrentItem(itemLots.find(x => x.id===currentItem.id,
            ))             
        }else{
            setCurrentItem([{}]);
        }
    }
    useEffect(() => { 
        if(currentItem.id>0) getCurrentItem();
    },[currentItem.id]);
    const formik = useFormik({
        validateOnChange: false,
        initialValues: {
            lotId:        "",
            articleId:    "",
            receivedDate:  "",
            expDate:      "",
            note:         "",
            isActived:false
        },
        
        onSubmit: async (values, {resetForm}) => {
            try {

                let data = {
                    lotId:lot.id,  
                    articleId:    lot.articleId,
                    receivedDate:  values.receivedDate,
                    expDate:      values.expDate,
                    note:         values.note,
                    isActived:    values.isActived,
                    items: []
                }     
                setsending(true);
                axios({
                    method: data.lotId === 0 ? "POST" : "PUT",
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
                    }

                }).catch((err) => {
                    let fetchError = err;
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
    const allItems = () => {          
        const url = '/Inventory/Itemlot/'+lot.id;
        axios.get(url).then((res) => {           
            if(res.result){
                setItemLots(res.data);        
            }else{
                setItemLots([]);                
            }
        }).catch((err) => {
            console.error(err);
        });
    }
    const columns  = [    
        {         
            field: 'id',     
            headerName: '#',
            maxWidth: 60,
            minWidth: 60,
            flex: 1,
            sortable: false,
            renderCell: (cellValues) =>  
                <Tooltip title="clik para editar" placement="top">                     
                    <TextField  
                        sx={{
                            fontWeight: 'normal', 
                            mb:0, 
                            justifyContent: "start"
                        }} 
                        fullWidth 
                        variant="standard"
                        onClick={() => openAddItemModal(cellValues.row)}
                        value={ cellValues.row.id } 
                    />                        
                </Tooltip>         
        },{ 
            editable: true,
            field: 'weight',     
            headerName: 'Peso',
            maxWidth: 50,
            minWidth: 50,
            flex: 1,
            sortable: true,                                
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
            editable: false,
            field: 'condition.name',     
            headerName: 'Condición',
            maxWidth: 150,
            minWidth: 150,
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
        },{ 
            editable: true,
            field: 'note',     
            headerName: 'Nota',
            maxWidth: 200,
            minWidth: 100,        
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
        },{ 
            field: 'createdAt',    
            headerName: 'Creación',
            sortable: false,
            maxWidth: 100,
            minWidth: 100,
            flex: 1,
            headerAlign: 'center',
            valueFormatter: params => 
            moment(params?.value).format("DD/MM/YYYY")
        }
        ]
    const { errors, touched, values, isSubmitting, handleSubmit, getFieldProps, setFieldValue, resetForm } = formik;
    useEffect(() => {               
        
        allItems();
         
    },[]);
    /* const getItems = () => {
       
        const url = '/inVenTory/LotS/'+lot.articleId+'/';
        axios.get(url).then((res) => {           
            if(res.data.result){
                setItemLots(res.data.data);        
            }else{
                setItemLots([]);                
            }
        }).catch((err) => {
            console.error(err);
        });
    } */
    const resetModalAddItem = () => { // recarga modal padre
        setShowAddItemModal(false);
        allItems();
    }
    return (
        <>
        {showAddItemModal && <AddItemModal 
            show={showAddItemModal}
            handleShowModal={(show) => {
                setShowAddItemModal(false);
            }}
            permissions={permissions}
            reset={() => resetModalAddItem()}
            articleName                        
            currentItem={currentItem}
        />}
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
                    <Typography id="modal-modal-title" variant="h5" component="h4" sx={{mb: 3}}>
                        {lot.name}
                    </Typography>                   
                    <Typography id="modal-modal-title" variant="h4" component="h4" sx={{mb: 3}}>
                        {"Lote # "+lot.id +" - " + moment(lot.receivedDate).format('DD/MM/YYYY')}
                    </Typography>    
                    {/* data inventario */}
                    
                    <hr/>  
                    <br/>  

                    <div style={{display: 'table', tableLayout:'fixed', width:'100%'}}>                         
                        <DataGrid autoHeight 
                            sx={{mb:6}}
                            rows={itemLots}                           
                            columns={columns}
                            
                            rowHeight={25}
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
                            rowCount={Object.keys(itemLots || {} ).length}

                            // disableColumnFilter
                            // disableColumnMenu                            
                            disableColumnSelector
                            disableSelectionOnClick
                            editable
                            // checkboxSelection
                        />

                    </div>
                    <Grid item md={4} xs={4}>
                        <Tooltip title="Crear un nuevo lote" placement="top-start">
                            <Button
                                id="newLot"
                                sx={{mb: 2}}
                                variant="contained"
                                component="label"
                                fullWidth
                                onClick={() => openAddItemModal({id:0,lotId:lot.id})}
                            >
                                Nuevo Item
                            </Button>
                        </Tooltip>
                    </Grid>                                 
                </RootStyle>
        </Modal>
        </>
    );
    
}

export default ItemLotManger;