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
    height:"90%",
    margin: "auto",
    maxWidth: "800px",
    backgroundColor: "#fff",
    position: "fixed",
    display: "block",    
    zIndex: "1000",
    overflowY: "auto",
    top:"20"
  
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

function ItemLotManger({ 
    show = false, 
    handleShowModal = (show) => {}, 
    reset = () => {},    
    articleName = null,
    articleId =null,
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
    const [nexNumItem,setNexNumItem]            =useState({});
   
    const openAddItemModal = (row) => {
        row.name=lot.name;
        setCurrentItem(row);
        setShowAddItemModal(true);       
      
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
            headerName: 'Cod.',
            headerAlign: 'center',
            maxWidth: 60,
            minWidth: 60,
            flex: 1,
            sortable: true,
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
        },
        {         
            field: 'numitem',     
            headerName: '#',
            headerAlign: 'center',
            maxWidth: 60,
            minWidth: 60,
            flex: 1,
            sortable: true,
            filterable: true,
            type:'number',
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
                        value={ cellValues.row.numItem } 
                    />                        
                </Tooltip>         
        },{ 
            editable: true,
            field: 'weight',     
            headerName: 'Peso',
            headerAlign: 'center',
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
            headerAlign: 'center',
            maxWidth: 130,
            minWidth: 130,
            flex: 1,
            sortable: true,
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
            field: 'updatedAt',    
            headerName: 'Actualizado',
            sortable: true,
            maxWidth: 175,
            minWidth: 175,
            flex: 1,
            headerAlign: 'center',
            type:'dateTime',
            /* renderCell: (cellValues) => { 
                let data = cellValues;                
                return  <Typography 
                    sx={{
                        fontWeight: 'bold', 
                        mb:0, 
                        justifyContent: "start"
                    }} 
                    fullWidth 
                    variant="body"
                    
                    >
                        {}
                       // {moment(data.row.updatedAt).format('DD-MM-YYYY')+" "+ moment(data.row.updatedAt).format('LT')} 
                    </Typography>   
            }  */            
            valueFormatter: params => 
            moment(params.value).format('DD-MM-YYYY h:mm a')/* +" "+ moment(params.value).format('LT')   */
        },{ 
            editable: true,
            field: 'note',     
            headerName: 'Nota',
            headerAlign: 'center',
            maxWidth: 200,
            minWidth: 100,        
            flex: 1,
            sortable: true,
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
            field: 'editar',    
            headerName: '',
            sortable: true,
            maxWidth: 95,
            minWidth: 95,            
            headerAlign: 'center',
            align: 'center',
            filterable: false,
            renderCell: (cellValues) => {
                let data = cellValues;
                return <Button                    
                    variant="contained"
                    color="primary" 
                    onClick={() => openAddItemModal(data.row)}
                >
                    Editar
                </Button>
            }
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
    const numItem =  async ()  => {       
        const url = '/Inventory/currentNumItem/'+lot.articleId;
         await axios.get(url).then((res) => {           
            if(res.result){
                 setNexNumItem(res.data.currentItem);
                // xItem=res.data                
                console.log("nexNumItem")
                console.log(nexNumItem)
                console.log("res.data")
                console.log(res.data)
                // return  res.data.setNexNumItem   
            }
        }).catch((err) => {
            console.error(err);
        });
    } 
    return (
        <>
        {showAddItemModal && <AddItemModal 
            show={showAddItemModal}
            handleShowModal={(show) => {
                setShowAddItemModal(false);
            }}
            nextNum={nexNumItem.currentItem}
            permissions={permissions}
            reset={() => resetModalAddItem()}
            articleName 
            articleId={lot.articleId}                     
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
                <CloseModal onClick={() => handleShowModal(false)}> 
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-x-lg" viewBox="0 0 16 16">
                        <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z"/>
                    </svg>
                </CloseModal>
                    <Typography id="modal-modal-title" variant="h5" component="h4" sx={{mb: 3}}>
                        {lot.name }
                    </Typography>                   
                    <Typography id="modal-modal-title" variant="h4" component="h4" sx={{mb: 3}}>
                        {"Lote # "+lot.id +" - " + moment(lot.receivedDate).format('DD/MM/YYYY') +" ( "+ itemLots.length +" ) "}
                    </Typography>    
                    {/* data inventario */}
                    
                    <hr/>  
                    <br/>  

                    <div style={{display: 'table', tableLayout:'fixed', width:'100%'}}>                         
                        <DataGrid 
                        
                            autoHeight 
                            sx={{mb:6}}
                            rows={itemLots}                           
                            columns={columns}
                            
                            // rowHeight={30}
                            // onCellEditStop={(params) => handleCellEditStop(params)}
                            // experimentalFeatures={{ newEditingApi: true }}
                            // onCellEditStart={(params) => handleCellEditStart(params)}
                            // processRowUpdate={processRowUpdate}

                            // onCellEditCommit={(params) => handleCellEditStop(params)}
                            // onCellFocusOut={(params)   => validateChanges(params)}
                            
                            // page={0}
                            pageSize={10}
                            rowsPerPageOptions={[10,20,30]}
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