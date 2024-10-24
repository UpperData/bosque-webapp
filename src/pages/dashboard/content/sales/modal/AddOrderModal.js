import React, {useEffect, useState} from 'react'

import {     
    Grid,    
    Typography,       
    Card, 
    Modal, 
    InputLabel,     
    Select, 
    MenuItem,     
    FormControl,
    CardContent,    
    Button   
} from '@mui/material';
import {  styled } from '@mui/material/styles';
import { DataGrid } from '@mui/x-data-grid';
import * as Yup from 'yup';
import { useFormik, Form, FormikProvider } from 'formik';
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
    maxWidth: "800px",
    height:"650px",
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
 
function AddOrderModal({ 
    show = false, 
    handleShowModal = (show) => {}, 
    reset = () => {},    
    permissions = null,    
    client=null,
}) {           
    const [sending, setsending]                     =useState(true);    
    const [article,setArticle]                      =useState(null);
    const [articleList,setArticleList]              =useState([{}]);
    const [loading, setloading]                     =useState(true);
    const [stockList,setStockList]                  =useState([{}]);
    const [currentItem,setCurrentItem]        =useState([{}]);
   
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
                id:         "",      
                lotId:      "", 
                articleId:  ""  ,
                items:      [{        
                                weight:"",
                                conditionId:"",
                                note:"",
                                numItem:""
                            }]
            }
                    
            setsending(true);
            
            axios({
                method: "POST",
                url:    "/CAR/AdD",
                data
            }).then((res) => {
                setsending(false);
                
                if(res.data.result){                                            
                    toast.success(res.data.message);                        
                    // resetForm();                         
                }else{
                    toast.warning(res.data.message);
                }
                reset(); 
                

            }).catch((err) => {
                console.log('__Error procesando ITEM____');
                console.log(err.response);
                           
            });

            
        }
    });
    
    const articleChanged = (artId)=>{
        setArticle(artId); 
        if(article) {getStock()}      
        // setCurrentItem(articleList.find(x => x.id===currentItem.id))        
    }

    const getArticles = () => {              
        axios.get("/Inventory/stock/ARTi/ALl")
        .then((res) => {  
            let dataList = res.data.rows;          
            if(res.data.count > 0){
                setArticleList(dataList);  
                setloading(false); 
            }
        }).catch((err) => {
            console.error(err);
        });
    }
    const getStock = () => {              
        axios.get("/Inventory/stock/art/"+article)
        .then((res) => {              
            let dataList = res.data.rows;  
            let rs=[]
            if(res.data.count > 0){
                for (let index = 0; index < res.data.rows.length; index++) {
                    rs.push ({"id":res.data.rows[index].id,"name":res.data.rows[index].name});                    
                }
                console.log(rs)  
                setStockList(rs); 
                
                setloading(false);
            }       
                 
        }).catch((err) => {
            console.error(err);
        });
    }
    let columns = [
        { 
            editable: false,
            field: `id`,     
            headerName: 'ID',
            maxWidth: 50,
            minWidth: 50,
        
        },
        { 
            editable: false,
            field: 'price',     
            headerName: 'Precio',
            maxWidth: 50,
            minWidth: 50,
            hide: true
        
        },
        { 
            editable: false,
            field: 'lots.itemLots.numItem',     
            headerName: '#',
            maxWidth: 50,
            minWidth: 50,
            flex: 1,
            sortable: false,
            headerAlign: 'center',
            renderCell: (cellValues) => {
                let data = cellValues;                
                return  <Typography 
                            sx={{
                                fontWeight: 'bold', 
                                mb:0, 
                                justifyContent: "start",
                                fontSize:[18]
                            }} 
                            fullWidth 
                            variant="body"
                                                        
                        >
                            {data.row['lots.itemLots.numItem']} 
                        </Typography>
            } 
        },

        { 
            editable: false,
            field: 'lots.itemLots.weight',     
            headerName: 'Existencia',
            maxWidth: 80,
            minWidth: 80,
            flex: 1,
            sortable: true,
            headerAlign: 'center',
            renderCell: (cellValues) => {
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
                            {parseFloat(data.row['lots.itemLots.weight']).toFixed(2)}
                        </Typography>
            }
        },{ 
            field: 'finalWeigth',     
            headerName: `Peso kg`,
            maxWidth: 100,
            minWidth: 100,
            flex: 1,
            sortable: false,
            align:'center',
            BorderAll:4,
            editable:true,
            type: 'number',
            renderCell: (cellValues) => {
                let data = cellValues;                    
                return  <Typography sx={{fontWeight: 'bold', mb:0}} variant="body">
                            {parseFloat(data.row.finalWeigth || 1).toFixed(2) }                        
                        </Typography>   
            
            /* <TextField
                            hiddenLabel
                            size='small'
                            fullWidth
                            autoComplete="lastname"
                            type="number"
                            label=""                            
                            InputProps={{
                                readOnly: true,
                                style: {textAlign: 'center'}
                            }}
                            value={parseFloat(data.row.finalWeigth || 1).toFixed(2) }
                        /> */
                            
                                  },

            // valueGetter: (params) =>`${parseFloat(params.row.weigth || 1).toFixed(2)}`
           
        },{ 
            editable: false,
            field: 'aprox.',     
            headerName: 'Precio aprox.',
            maxWidth: 120,
            minWidth: 80,
            flex: 1,
            sortable: true,
            headerAlign: 'center',
            renderCell: (cellValues) => {
                let data = cellValues;                
                let aproxPrice=parseFloat(data.row['lots.itemLots.finalWeigth']).toFixed(2);
                return  <Typography 
                            sx={{
                                fontWeight: 'bold', 
                                mb:0, 
                                justifyContent: "start",
                                fontSize:[16]
                            }} 
                            fullWidth 
                            variant="body"                            
                        >
                            {"$"+parseFloat(aproxPrice).toFixed(2)}
                        </Typography>
            }
        },  
         { 
            
            field: 'note',    
            headerName: 'Nota',
            sortable: true,
            maxWidth: 150,
            minWidth: 100,
            flex: 1,
            headerAlign: 'center',
            editable: true,            
            renderCell: (cellValues) => { 
                let data = cellValues;                
                return <Typography
                                sx={{
                                    fontWeight: 'bold', 
                                    mb:0, 
                                    justifyContent: "start",
                                    fontSize:[16]
                                }} 
                            >
                                {cellValues.row.note}
                        </Typography>
                        
            }
        },
         {
            field:'',
            sortable: false,
            headerAlign: 'center',                
            maxWidth: 160,
            minWidth: 160,   
            renderCell: (cellValues) => (              
                
                    <Button 
                    onClick={console.log(cellValues.id)} 
                    variant="contained" 
                    color="primary" 
                    fullWidth sx={{px : 3}} 
                    size="normal"
                >
                        Agregar
                    </Button>                    
               
            )
        } 
        
    ];

    
   const { errors, touched, values, isSubmitting, handleSubmit, getFieldProps, setFieldValue, resetForm } = formik;    
    useEffect(  () => {
            if(sending) {getArticles()}
           
         },[article]
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
                    <Form autoComplete="off" noValidate /* onSubmit={handleSubmit } */ id="form1">
                        <CloseModal onClick={() => handleShowModal(false)}> 
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-x-lg" viewBox="0 0 16 16">
                                <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z"/>
                            </svg>
                        </CloseModal>
                        <Typography sx={{mb: 4}} id="modal-modal-title" variant="h3" component="h3">
                                {client.people.document.firstName?"Agregar pedido para "+ client.people.document.firstName + "(" + client.id +")" : "Agregar al cliente # " + client.id }
                        </Typography>
                        
                        <br />
                        
                        <Grid >
                            <Grid item xs={12}>                                   
                                <FormControl fullWidth size="small">
                                    <InputLabel id="doctors">
                                        Especie
                                    </InputLabel>
                                    <Select                                       
                                        labelId="Especie"
                                        id="especieSelect"
                                        defaultValue=""
                                        value={!article ? "" : article}
                                        onChange={(e) => articleChanged(e.target.value)}
                                        label="especie"
                                        // MenuProps={MenuProps}
                                        // disabled={municipios.length === 0}

                                        // {...getFieldProps('departamento')}
                                        // error={Boolean(touched.municipio && errors.municipio)}
                                        // helperText={touched.departamento && errors.departamento}
                                    >


                                        {
                                        
                                        

                                         articleList.map((item, key) => {
                                                let dataItem = item;
                                                
                                                return <MenuItem key={key} value={dataItem.id}>
                                                            
                                                                <Typography  id="modal-modal-title" variant="h3" component="h3">
                                                                    {dataItem.name + " - $" + parseFloat(dataItem.price).toFixed(2)}
                                                                </Typography>
                                                            
                                                            
                                                        </MenuItem>
                                            }) }
                                    </Select>  
                                </FormControl>
                            </Grid>
                            </Grid> 
                            <div className="inventario-content-table">                                    
                            <div style={{display: 'table', tableLayout:'fixed', width:'100%'}}>
                           
                                {!loading && article &&
                                         
                                    <DataGrid 
                                        
                                        sx={{mb:8}}
                                        rows={stockList}
                                        // getRowId={(row) => row.name}
                                        // getRowId={(row) => row.id}
                                        columns={columns}
                                        page={0}
                                        // pageSize={10}
                                        rowsPerPageOptions={[10,15,30]}
                                        // autoPageSize
                                        rowCount={stockList.length}

                                        // disableColumnFilter
                                        // disableColumnMenu
                                        autoHeight 
                                        disableColumnSelector
                                        disableSelectionOnClick
                                        // editable
                                        // checkboxSelection
                                    /> 
                                }

                                {loading &&
                                    <Card sx={{py: 3, px: 5}}>
                                        <Loader />
                                    </Card>
                                }
                            
                            </div>                                    
                            </div>
                        
                    </Form>
                </FormikProvider>
            </RootStyle>
        </Modal>
    );
}

export default AddOrderModal;