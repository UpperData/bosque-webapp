import React, {useEffect, useState} from 'react'
import AddLotModal from "./AddLotModal";
import ItemLotModal from "./ItemLotManger";
import {   
    Grid,
    Typography,
    Card, 
    Hidden, 
    Button, 
    Modal,
    TextField,
    Tooltip
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { styled } from '@mui/material/styles';

import * as Yup from 'yup';
import { useFormik } from 'formik';
import moment from "moment";
import axios from "../../../../../auth/fetch"

import { toast } from 'react-toastify';

const RootStyle = styled(Card)(({ theme }) => ({
    boxShadow: 'none',
    textAlign: 'center',
    padding: theme.spacing(5, 5),
    width: "95%",
    margin: "auto",
    maxWidth: "60%",
    maxHeight: "90%",
    overflowY: "auto",
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

function LotesArticleModal({ 
    show = false, 
    handleShowModal = (show) => {}, 
    reset = () => {}, 
    edit = null ,
    permissions= null
}) {
    let items=[];    
       
   
    const [sending, setsending] = useState(false);    
    const [articlesLots, setArticlesLots] = useState([]);
    const [currentLot,setCurrentLot] = useState([]);        
    const [currenItem,setCurrenItem] =useState(0);
    const [showAddLotModal, setshowAddLotModal] = useState(false);
    const [showItemLotModal, setshowItemLotModal] = useState(false);
    const [updatedData,setUpdatedData] =useState(false)
    const getItems = () => {
       
        const url = '/inVenTory/LotS/'+edit.id+'/*';
        axios.get(url).then((res) => {           
            if(res.data.result){
                setArticlesLots(res.data.data); 
                setUpdatedData(true);       
            }else{
                setArticlesLots([]);                
            }
        }).catch((err) => {
            console.error(err);
        });
    }
    const getCurrentLot = () => {        
        if(currentLot.id>0){
            setCurrentLot(articlesLots.find(x => x.id===currentLot.id,
            ))             
        }else{
            setCurrentLot([{}]);
        }
    }
    useEffect(() => { 
        if(currentLot.id>0) getCurrentLot();
    },[currentLot.id]);

    useEffect(() => {               
        if(!updatedData) getItems();
         
    },[articlesLots]);
  
    const openAddLotModal = (lot) => {        
        setCurrentLot(lot)
        setshowAddLotModal(true);        
    }
    const openItemLotModal=(row)=>{  
        row.name=edit.name;
        setshowItemLotModal(true);
        setCurrentLot(row);
    }
    const resetModalAddItem = () => { // recarga modal padre
        getItems();
        setshowAddLotModal(false);
        
    }
    const resetModalItem = () => { // recarga modal padre
        setshowItemLotModal(false);
        getItems();
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
                lotId:currentLot.id,
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
                setUpdatedData(false);        
                
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
                lotId:currentLot.id,
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
                reset();
                setUpdatedData(false)
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
        headerName: '#',
        maxWidth: 60,
        minWidth: 60,
        flex: 1,
        sortable: true,   
        headerAlign:'center',     
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
                    onClick={() => openAddLotModal(cellValues.row)}
                    value={ cellValues.row.id } 
                />                        
            </Tooltip>         
    },{ 
        editable: false,
        field: 'receivedDate',     
        headerName: 'Ingreso',
        maxWidth: 150,
        minWidth: 150,        
        sortable: true,
        headerAlign:'center',
        type: 'date',        
        dataFormat:'yyyy-mm-dd',
        valueFormatter: params => 
            moment(params.value).format('DD-MM-YYYY')
        
    },{ 
        editable: false,
        field: 'expDate',     
        headerName: 'Vencimiento',
        maxWidth: 150,
        minWidth: 150,
        flex: 1,
        sortable: true,
        headerAlign:'center', 
        type: 'date',         
        dataFormat:'yyyy-mm-dd',/* 
        renderCell: (cellValues) =>  
            <Tooltip title="Fecha expiración" placement="top">                     
                <TextField  
                    sx={{
                        fontWeight: 'bold', 
                        mb:0, 
                        justifyContent: "start"
                    }} 
                    fullWidth 
                    variant="standard"
                    type='date'
                    // value={ cellValues.row.expDate } 
                    value={ moment(cellValues.row.expDate).format('yyy-MM-dd') } 
                />                        
            </Tooltip> */
            valueFormatter: params => 
                moment(params.value).format('DD-MM-YYYY')
    },{ 
        editable: false,
        field: 'qty',     
        headerName: 'Cant.',
        headerAlign:'center',
        maxWidth: 60,
        minWidth: 60,
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
        editable: false,
        field: 'isActived',     
        headerName: 'Estado',
        headerAlign:'center',
        maxWidth: 80,
        minWidth: 80,
        flex: 1,
        sortable: true,
        renderCell: (cellValues) =>  
            <Tooltip title="Status del lote" placement="top">                     
        <TextField  
            sx={{
                fontWeight: 'bold', 
                mb:0, 
                justifyContent: "start"
            }} 
            fullWidth 
            variant="standard"
            // onClick={() => openAddLotModal()}
            value={ cellValues.row.isActived?"Activo":"Inactivo" } 
        />                        
    </Tooltip>
               
        
    },{ 
        editable: false,
        field: 'note',     
        headerName: 'Nota',
        headerAlign:'center',
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
    },
    { 
        field: '',    
        headerName: '',
        sortable: false,
        maxWidth: 100,
        minWidth: 100,
        flex: 1,
        filterable: false,
        headerAlign: 'center',
        renderCell: (cellValues) => {
            let isPublished = true;

            return <Button
                
                variant={isPublished ? "contained" : "outlined"}
                color="primary" 
                onClick={() => openItemLotModal(cellValues.row)}
               
            >
                Items
            </Button>
        }
    },
    { 
        field: 'editar',    
        headerName: '',
        sortable: false,
        maxWidth: 100,
        minWidth: 100,
        filterable: false,
        flex: 1,
        headerAlign: 'center',
        renderCell: (cellValues) => ( 
            <Button                
                variant= "contained"
                color="primary" 
                // onClick={() => openItemLotModal(cellValues.row)}
                onClick={() => openAddLotModal(cellValues.row)}               
            >
                Editar
            </Button>
        )
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
                lotId={currentLot.id}
                currentLot={currentLot}
            />
            {showItemLotModal && <ItemLotModal                 
                show={showItemLotModal}
                handleShowModal={(show) => {
                    setshowItemLotModal(false);
                }}
                reset={() => resetModalItem()}                
                lot={currentLot}
            />}
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
                    <CloseModal onClick={() => handleShowModal(false)}> 
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-x-lg" viewBox="0 0 16 16">
                            <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z"/>
                        </svg>
                    </CloseModal>
                    <Typography id="modal-modal-title" variant="h4" component="h4" sx={{mb: 3}}>
                        {!edit ? 'Agregar Lote' : 'Lotes de '+ edit.name}
                    </Typography>                   
                        
                    {/* data inventario */}
                    
                    <hr/>  
                    <br/>  
                    <Grid container justifyContent="space-between" columnSpacing={1}>                                
                            <Grid sx={{mb: 2}} item md={1} xs={12}>
                                
                                <Button variant="contained"
                                onClick={() => getItems()} >
                                Actualizar
                                </Button>

                            </Grid>
                        </Grid>
                    <div style={{display: 'table', tableLayout:'fixed', width:'100%'}}>                         
                        <DataGrid 
                            autoHeight 
                            sx={{mb:12}}
                            rows={articlesLots}                           
                            columns={columns}
                            
                           // rowHeight={30}
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
                            rowCount={Object.keys(currentLot || {} ).length}
                            
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
                                
                                // onClick={() => openAddArticleModal()}
                                onClick={() => openAddLotModal({id:0})}
                            >
                                Nuevo Lote
                            </Button>
                        </Tooltip>
                    </Grid>                                 
                </RootStyle>
            </Modal>
        </>
    )
}

export default LotesArticleModal;