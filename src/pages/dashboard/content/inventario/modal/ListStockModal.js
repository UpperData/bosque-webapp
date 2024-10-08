import React, {useEffect, useState} from 'react'
import AddLotModal from "./AddLotModal";
import ItemLotModal from "./ItemLotManger";
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
function ListStockModal({ 
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
    const [stockList, setStockList] = useState([]);
    const [currentLot,setCurrentLot] = useState([]);        
    const [currenItem,setCurrenItem] =useState(0);
    const [showAddLotModal, setshowAddLotModal] = useState(false);
    const [showItemLotModal, setshowItemLotModal] = useState(false);
    const [refresh, setRefresh] =useState(true)
    
    const getItems = () => {
       
        const url = '/inVenTory/LotS/'+edit.id+'/*';
        axios.get(url).then((res) => {           
            if(res.data.result){
                let dataStock=res.data.data;                
                let formatedDataStock=[];
                // obtiene lo items por articulos 
                for (let index = 0; index < dataStock.length; index++) { 
                    if(dataStock[index].isActived){ // discrimina lotes activos
                        for (let jindex = 0; jindex < dataStock[index].itemLots.length; jindex++) {                         
                            if(dataStock[index].itemLots[jindex].conditionId===1){ // discrimina Items disponible
                                formatedDataStock.push(dataStock[index].itemLots[jindex])
                            }
                            
                        }
                    }
                }                
                setStockList(formatedDataStock);        
            }else{
                setStockList([]);                
            }
        }).catch((err) => {
            console.error(err);
        });
    }

    useEffect(() => { 
        getItems();
    },[]);

   

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
        setshowAddLotModal(false);
        getItems();
    }
    const resetModalItem = () => { // recarga modal padre
        setshowItemLotModal(false);
        getItems();
    }
    const editItemData = (itemData) => {        
        let data = {
            articleId:  itemData.articleId,
            existence:  itemData.existence,
            price:      itemData.price,
            minStock:   itemData.minStock
        }
        setsending(true);
        

        axios({
            method: "PUT",
            url:    "urlEditItemData",
            data
        }
            // config
        ).then((res) => {          
            getList();
            if(res.data.result){
                setTimeout(() => {
                    toast.success(res.data.message);
                }, 2000);
            }

        }).catch((err) => {
            let fetchError = err;
        });
    }
    const handleCellEditStop = (params) => {       
      
        let dataBeforeEdit = params.row;
        if(dataBeforeEdit[params.field] !== params.value){

            dataBeforeEdit[params.field] = params.value;          
            let dataToEdit = dataBeforeEdit;
            editItemData(dataToEdit);
        }
    };
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
        headerName: '#',
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
                    value={ cellValues.row.id } 
                />                        
            </Tooltip>         
    },{ 
        editable: false,
        field: 'qty',     
        headerName: 'Especie',
        maxWidth: 100,
        minWidth: 100,
        flex: 1,
        sortable: true,
        renderCell: (cellValues) => { 
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
                    {edit.name} 
                </Typography>   
        }
    },{ 
        editable: false,
        field: 'weight',     
        headerName: 'Peso',
        maxWidth: 80,
        minWidth: 80,
        flex: 1,
        sortable: true,
        renderCell: (cellValues) =>                                   
            <TextField  
                sx={{
                    fontWeight: 'bold', 
                    mb:0, 
                    justifyContent: "start"
                }} 
                fullWidth 
                variant="standard"
                // onClick={() => openAddLotModal()}
                value={ cellValues.row.weight + " Kg" } 
            />
    },{ 
        editable: false,
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
                       {"Stock de " +edit.name +" ( "+stockList.length+" )"} 
                    </Typography>                   
                        
                    {/* data inventario */}
                    
                    <hr/>  
                    <br/>  

                    <div style={{display: 'table', tableLayout:'fixed', width:'100%'}}>                         
                        <DataGrid autoHeight 
                            sx={{mb:6}}
                            rows={stockList}                           
                            columns={columns}
                            
                            rowHeight={30}
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
                                                  
                </RootStyle>
            </Modal>
        </>
    )
}

export default ListStockModal;