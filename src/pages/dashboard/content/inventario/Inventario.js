import {useState, useEffect} from "react"
import * as Yup from 'yup';
import { useFormik, Form, FormikProvider } from 'formik';
import { Link, useLocation } from 'react-router-dom';
import Excel from 'exceljs';
import { saveAs } from 'file-saver';
import moment from "moment";

// material
import { Box, Grid, Stack, ToggleButtonGroup,ButtonGroup, Tooltip, Container, Typography, Alert,  Card, CardContent, Hidden, Button, Modal, TextField, Checkbox, Select, MenuItem, InputLabel, FormControl } from '@mui/material';
import { DataGrid, DataGridProps } from '@mui/x-data-grid';

// components
import Page from '../../../../components/Page';
import axios from "../../../../auth/fetch"
import Loader from '../../../../components/Loader/Loader';

import Icon from '@mdi/react';
import CaretDown from "@iconify/icons-ant-design/caret-down"
import CaretUp from "@iconify/icons-ant-design/caret-up"
import CaretRight from "@iconify/icons-ant-design/caret-right"
import CaretLeft from "@iconify/icons-ant-design/caret-left"
import { getPermissions } from "../../../../utils/getPermissions";
import { useSelector } from "react-redux";
import { toast } from 'react-toastify';
import ExportExcel from "react-export-excel"
import AddArticleModal from "./modal/AddArticleModal";
import AddInventoryModal from "./modal/AddInventoryModal";
import ChangePublishedStatusModal from "./modal/ChangePublishedStatusModal";
import LotesArticleModal from "./modal/LotesArticleModalFull";
import { CSVLink} from 'react-csv';

const ExcelJS = require("exceljs");

const ExcelFile     = ExportExcel.ExcelFile;
const ExcelSheet    = ExportExcel.ExcelSheet;
const ExcelColumn   = ExportExcel.ExcelColumn;

// ----------------------------------------------------------------------

function Inventario() {

    // const [data, setdata]                            = useState(rows);
    const [count, setcount]                             = useState(0);    
    const [loading, setloading]                         = useState(true);
    const [search, setsearch]                           = useState(true);
    const [data, setdata]                               = useState(null);
    const [list, setlist]                               = useState([]);

    const [typeForm, settypeForm]                       = useState("create");
    const [itemToEdit, setitemToEdit]                   = useState(null);

    const [openSaveChanges, setopenSaveChanges]         = useState(false);
    const [sending, setsending]                         = useState(false);

    const [openModalArticle,setOpenModalArticle] =useState(false);
    const [openModalAddItem, setopenModalAddItem]           = useState(false);
    const [openModalPublishItem, setopenModalPublishItem]   = useState(false);

    const [alertSuccessMessage, setalertSuccessMessage] = useState("");
    const [alertErrorMessage,   setalertErrorMessage]   = useState("");

    // const [editingItemInTable, seteditingItemInTable]   = useState(null);
    const [changeInputStock, setchangeInputStock]       = useState(false);
    const [stockdata, setStockdata]= useState([]); 
    const [currentArticle, setCurrentArticle]           =useState([{id:0}])
   
    const urlGetData        = "/InveTorY/get/ALL";
    const urlEditItemData   = "/InvEToRY/UpdaTE/ARTICLE";

    // Permissions
    const location                              = useLocation();
    let MenuPermissionList                      = useSelector(state => state.dashboard.menu);
    let permissions                             = getPermissions(location, MenuPermissionList);

    const getList = async () => {

        setsearch(true);
        axios.get(urlGetData)
        .then((res) => {
            settypeForm("create");
            setitemToEdit(null);

            setdata(res);
            setlist(res.items);

            setsending(false);
            setloading(false);

        }).catch((err) => {

            let error = err.response;
            if(error){
                if(error.data){
                    setloading(true);
                }
            }
            
        });
        
    }

    useEffect(async () => {
        if(loading){
            if(search){
                await getList();
            }
        }
    }, []);

    const editItem = (data) => {
        settypeForm("edit");
        setitemToEdit(data);
        setopenModalAddItem(true);
    }
    const editPublishedItem = (data) => {
        setitemToEdit(data);
        setopenModalPublishItem(true);
    }

    const openModal = () => {
        setitemToEdit(null);
        settypeForm("create");
        // setopenModalAddItem(true);
        setOpenModalArticle(true);
    }

    let iconPath =  require('@mdi/js')['mdiCheckboxBlank'];
    let columns = [
        
        { 
            editable: true,
            field: 'id',     
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
                                justifyContent: "start"
                            }} 
                            fullWidth 
                            variant="body"
                            onClick={() => editItem(data.row)}
                        >
                            {data.row.id} &nbsp; <i className="mdi mdi-pencil" />
                        </Typography>
            }
        },   
        { 
            editable: true,
            field: 'name',     
            headerName: 'Nombre',
            maxWidth: 250,
            minWidth: 200,
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
                            onClick={() => editItem(data.row)}
                        >
                            {data.row.name.toUpperCase()} &nbsp; <i className="mdi mdi-pencil" />
                        </Typography>
            }
        },        
        /* { 
            editable: true,
            field: 'existence',    
            headerName: 'Existencia',
            sortable: false,
            maxWidth: 120,
            minWidth: 120,
            flex: 1,
            headerAlign: 'center',
            renderCell: (cellValues) => {
                let data = cellValues;

                let count    = Number(data.row.existence);
                let minStock = Number(data.row.minStock);

                let colorAlert = "";
                if(count > minStock){
                    colorAlert = "#54D62C";
                }else if(count === minStock){
                    colorAlert = "#FFC107";
                }else if(count < minStock){
                    colorAlert = "#D0302A";
                }

                return  <Typography color="#D0302A">
                    {count}
                </Typography>
            }
        }, */
        { 
            
            field: 'price',    
            headerName: 'Precio Kg',
            sortable: true,
            maxWidth: 150,
            minWidth: 100,
            flex: 1,
            headerAlign: 'center',
            editable: true,
            type: 'number',
            renderCell: (cellValues) => {
                let data = cellValues;
                let price = data.row.price;
                let dolarValue = data.row.dolarValue;
                return <Tooltip title={`USD $${dolarValue}`} placement="top">
                            <Typography>
                                $ {price}
                            </Typography>
                        </Tooltip>
            }
        }, /* ,
        { 
            field: 'minStock',    
            headerName: 'Mínimo',
            sortable: false,
            maxWidth: 90,
            minWidth: 90,
            flex: 1,
            headerAlign: 'center',
            editable: true,
            type: 'number',
            renderCell: (cellValues) => {
                let data = cellValues;
                let minStock = data.row.minStock;
                
                return <Typography>
                    {minStock}
                </Typography>
            }

            // valueGetter: ({ value }) => value && Number(value),
            /*
                renderCell: (cellValues) => {
                    let data = cellValues;
                    let count = data.row.minStock;
                    return  <TextField
                                hiddenLabel
                                size='small'
                                fullWidth
                                autoComplete="lastname"
                                type="number"
                                label=""
                                InputProps={{
                                    type: "number",
                                    style: {textAlign: 'center'}
                                }}
                                value={count}
                            />
                }
           
        }    */ 
        
        { 
            editable: false,
            field: 'almacen',     
            headerName: 'Disponible',
            maxWidth: 130,
            minWidth: 100,
            flex: 1,
            sortable: true,
            headerAlign: 'center',
            renderCell: (cellValues) => {
                let data = cellValues;
                let almacen = data.row.almacen;
                return <Typography>
                    {almacen} 
                </Typography>
            }
        },    
        { 
            field: 'asignados',     
            headerName: `Reservado`,
            maxWidth: 90,
            minWidth: 90,
            flex: 1,
            sortable: true,
            headerAlign: 'center'
        },
        {
            headerName: `Descarga`, 
            headerAlign: 'center',    
            maxWidth: 160,
            minWidth: 160,   
            renderCell: (params) => (              
                <div>
                    <ToggleButtonGroup>
                        <Button
                        variant="contained"                        
                        color="primary" 
                        onClick={() =>saveExcel(params.row.id)}
                        >
                            XLS
                        </Button>
                        <Button
                        variant="contained" 
                        color="primary" 
                        onClick={() =>saveExcel(params.row.id)}
                        >
                            PDF
                        </Button>
                    </ToggleButtonGroup>   
                </div>
            )
            
            
        },
        { 
            field: 'isPublished',    
            headerName: 'Acción',
            sortable: true,
            maxWidth: 120,
            minWidth: 120,
            flex: 1,
            headerAlign: 'center',
            renderCell: (cellValues) => {
                let isPublished = cellValues.row.isPublished;

                return <Button
                    
                    variant={isPublished ? "contained" : "outlined"}
                    color="primary" 
                    onClick={() => editPublishedItem(cellValues.row)}
                >
                    {isPublished ? 'Ocultar' : 'Publicar'}
                </Button>
            }
        },
    ];

    const downloadItemArtice=(articleId)=>{        
        axios({
            method: "GET",
            url:    "/Inventory/Itemlot/true/"+articleId,
            responseType: 'blob'
        }            
        ).then((res) => {
            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${Date.now()}.xls`);
            document.body.appendChild(link);
            link.click();           
            if(res.data.result){
                
                toast.success(res.data.message);
                
            }else{
                toast.success(res.data.message);
            }

        }).catch((err) => {
            toast.error(err);
        });
    }
    const editItemData = (itemData) => {

        let data = {
            articleId:  itemData.articleId,
            existence:  itemData.existence,
            price:      itemData.price,
            minStock:   itemData.minStock
        }

        setsending(true);
        setalertSuccessMessage("");
        axios({
            method: "PUT",
            url:    urlEditItemData,
            data
        }            
        ).then((res) => {

            setchangeInputStock(false);
            setalertSuccessMessage(res.data.message);
            getList();

            setTimeout(() => {
                setalertSuccessMessage("");
            }, 2000);

            if(res.data.result){
                // resetForm();
                // setopenModalAddItem(false);
            }

        }).catch((err) => {
            let fetchError = err;
        });
    }

    const handleCellEditStop = (params) => {
        let dataBeforeEdit = params.row;
        if(dataBeforeEdit[params.field] !== params.value){
            // ------------------Edit-------------------------
            dataBeforeEdit[params.field] = params.value;
            console.log(dataBeforeEdit);
            let dataToEdit = dataBeforeEdit;
            editItemData(dataToEdit);
        }
    };

    const validateChanges = (params) => {
        if(params.field === "existence" && changeInputStock){
            console.log(params);
            let dataToEdit = params.row;
            editItemData(dataToEdit);
        }
    }

    const resetList = () => {
        getList();
        setopenModalAddItem(false);
        setopenModalPublishItem(false);
        setitemToEdit(null);
    }

    let items = list !== null ? list.filter(item => item.hasOwnProperty("id")) : [];

    const changeStock = (id, newCount) => {
        if(newCount >= 0){
            setchangeInputStock(true);

            let list        = [...data];
            let item        = list.find(item => item.id === id);
            let index       = list.indexOf(item);            
            item.existence  = newCount;
            list[index]     = item;
            setlist(list);
            setcount(count * 20);
        }
    }

    const handleCloseModalAddItem = () => {
        setopenModalAddItem(false);
    }

    const columnsXLS = [
        { header: '#', key: 'numOrder' },
        { header: 'Especie', key: 'name' },
        { header: 'Peso Kg', key: 'lots.itemLots.weight' },
        { header: 'Precio $ ', key:'weightPrice'},
        { header: 'note', key: 'lots.itemLots.note' },
        { header: 'code', key: 'lots.itemLots.id' }
      ];
 


    const getStockArticle= async (art)=>{                
        const url = "/INVETORY/get/Article/"+art;
        await axios.get(url).then((res) => { 
            console.log('----userdata----- '+ res.result);
            console.log(res.data);          
             if(res.result){                 
                setStockdata(res.data);               
                
             }else{
                setStockdata([]);                 
             }             
                 
         }).catch((err) => {
             console.error(err);
         }); 
         
    }
    
    const workSheetName = 'hoja-1';    
    const workbook = new Excel.Workbook(); 
    const saveExcel = async (artId) => {
         try {           
            getStockArticle(artId); 
            if(stockdata && stockdata.length>0){
                
                const fileName = stockdata.length>0?stockdata[0].name +"-"+ moment().format('YYY-MM-DD') : 'stock' ;                
                // creating one worksheet in workbook
                const worksheet = workbook.addWorksheet(workSheetName);
        
                // add worksheet columns
                // each columns contains header and its mapping key from data
                worksheet.columns = columnsXLS;
        
                // updated the font for first row.
                worksheet.getRow(1).font = { bold: true };
        
                // loop through all of the columns and set the alignment with width.
                worksheet.columns.forEach(column => {
                column.width = column.header.length + 5;
                column.alignment = { horizontal: 'left' };
                });
        
                // loop through data and add each one to worksheet
                stockdata.forEach(singleData => {
                worksheet.addRow(singleData);
                });
        
                // loop through all of the rows and set the outline style.
                worksheet.eachRow({ includeEmpty: false }, row => {
                // store each cell to currentCell
                const currentCell = row._cells;
        
                // loop through currentCell to apply border only for the non-empty cell of excel
                currentCell.forEach(singleCell => {
                    // store the cell address i.e. A1, A2, A3, B1, B2, B3, ...
                    const cellAddress = singleCell._address;
        
                    // apply border
                    worksheet.getCell(cellAddress).border = {
                    top: { style: 'thin' },
                    left: { style: 'thin' },
                    bottom: { style: 'thin' },
                    right: { style: 'thin' }
                    };
                });
                });
        
                // write the content using writeBuffer
                const buf = await workbook.xlsx.writeBuffer();
        
                // download the processed file
                saveAs(new Blob([buf]), `${fileName}.xlsx`);
            }
            
         }catch(error){
            console.log(error);
         } finally {
            // removing worksheet's instance to create new one
            workbook.removeWorksheet(workSheetName);
         }
                       
            setStockdata([])
    }
  
    return (
        <Page title="Inventario | Bosque Marino">
        <Container maxWidth="xl">
            <Box sx={{ pb: 3 }}>
                <Typography variant="h4" color="white.main">
                    Inventario
                </Typography>
            </Box>

            {openModalPublishItem &&
                <ChangePublishedStatusModal 
                    show={openModalPublishItem}
                    handleShowModal={(show) => {
                        setopenModalPublishItem(false);
                    }}
                    edit={itemToEdit}
                    reset={() => resetList()}
                />
            }

            {openModalAddItem &&
                <LotesArticleModal 
                    show={openModalAddItem}
                    handleShowModal={(show) => {
                        setopenModalAddItem(false);
                    }}
                    permissions={permissions}
                    edit={itemToEdit}
                    reset={() => resetList()}
                />
            }
            {openModalArticle && 
                <AddArticleModal
                    show={openModalArticle}
                    handleShowModal={(show) => {
                        setOpenModalArticle(false);
                    }}
                    permissions={permissions}                  
                    reset={() => resetList()}
                
                />
            }
            
            <Grid sx={{ pb: 3 }} item xs={12}>
                {!loading &&
                    <Card>
                        <CardContent>
                            <Grid container justifyContent="space-between" columnSpacing={3}>
                                <Grid sx={{mb: 2}} item md={3} xs={12}>
                                    <Button 
                                        onClick={() => openModal()} 
                                        variant="contained" 
                                        color="primary" 
                                        fullWidth sx={{px : 3}} 
                                        size="normal"
                                    >
                                        Añadir especie
                                    </Button>
                                </Grid>
                                {/* 
                                <Grid sx={{mb: 2}} item md={4} xs={12}>
                                    {data !== null
                                    ?
                                        <ExcelFile
                                            filename="inventario"
                                            element={
                                                <Button variant="contained" color="secondary" fullWidth sx={{px : 3}} size="normal">
                                                    Descargar Hoja de Inventario
                                                </Button>
                                            }
                                        >
                                            <ExcelSheet data={list} name="Inventario">
                                                
                                                    <ExcelColumn label="Producto" value={(col) => col.article.name} />
                                                    <ExcelColumn label="Existencia" value="existence" />
                                                    <ExcelColumn label="Precio (usd)" value="price" />
                                                    <ExcelColumn label="Stock mínimo" value="minStock" />
                                                    <ExcelColumn label="Almacén" value="almacen" />
                                                    <ExcelColumn label="Transito" value="asignados" />
                                                
                                            </ExcelSheet>
                                        </ExcelFile>
                                    :
                                        <Button disabled variant="contained" color="secondary" fullWidth sx={{px : 3}} size="large">
                                            Descargar Hoja de Inventario
                                        </Button>
                                    }
                                </Grid>
                                */}
                                
                            </Grid>

                            {alertSuccessMessage !== "" &&
                                <Alert sx={{mb: 3}} severity="success">
                                    {alertSuccessMessage}
                                </Alert>
                            }

                            {alertErrorMessage !== "" &&
                                <Alert sx={{mb: 3}} severity="error">
                                    {alertErrorMessage}
                                </Alert>
                            }
                        
                            {data !== null && data.length > 0 !== "" &&
                                <div className="inventario-content-table">

                                    {/*
                                        <Alert sx={{mb: 3}} severity="info">
                                            Puede modificar el valor de los elementos haciendo click.
                                        </Alert>
                                    */}

                                    <Grid container columnSpacing={3} justifyContent="end">
                                        <Grid md="auto" item xs={12} sx={{mb: 2}}>
                                            Total 
                                            <Typography sx={{fontWeight: "bold", ml: 1}} component="span">
                                                Bs {data.bolivaresTotalInventory}
                                            </Typography> 
                                        </Grid>
                                        <Grid md="auto" item xs={12} sx={{mb: 2}}>
                                            Total 
                                            <Typography sx={{fontWeight: "bold", ml: 1}} component="span">
                                                USD ${data.dolarTotalInventory}
                                            </Typography> 
                                        </Grid>
                                    </Grid>
                                    
                                    <div style={{display: 'table', tableLayout:'fixed', width:'100%'}}> 
                                        <DataGrid
                                            sx={{mb:4}}
                                            rows={items}
                                            columns={columns}

                                            // onCellEditStop={(params) => handleCellEditStop(params)}
                                            // experimentalFeatures={{ newEditingApi: true }}
                                            // onCellEditStart={(params) => handleCellEditStart(params)}
                                            // processRowUpdate={processRowUpdate}

                                            onCellEditCommit={(params) => handleCellEditStop(params)}
                                            onCellFocusOut={(params)   => validateChanges(params)}
                                            
                                            // page={0}
                                            pageSize={6}
                                            rowsPerPageOptions={[6,10,20]}
                                            // autoPageSize
                                            rowCount={items.length}

                                            // disableColumnFilter
                                            disableColumnMenu
                                            autoHeight 
                                            disableColumnSelector
                                            disableSelectionOnClick
                                            editable
                                            // checkboxSelection
                                        />
                                    </div>

                                    <ul style={{listStyle: "none"}}>
                                        <li>
                                            <Typography variant="h6" color="success" alignItems="center" flex>
                                                <Typography component="span" color="#54D62C">
                                                    <Icon path={iconPath} size={.9} />
                                                </Typography>
                                                <Typography sx={{ml: 2}} component="span" color="text.primary">
                                                    <Typography sx={{fontWeight: "bold", mr: 1}} component="span">
                                                        Satisfactorio:
                                                    </Typography> 
                                                    Articulo con alta solvencia.
                                                </Typography>
                                            </Typography>
                                        </li>
                                        <li>
                                            <Typography variant="h6" color="warning" alignItems="center" flex>
                                                <Typography component="span" color="#FFC107">
                                                    <Icon path={iconPath} size={.9} />
                                                </Typography>
                                                <Typography sx={{ml: 2}} component="span" color="text.primary">
                                                    <Typography sx={{fontWeight: "bold", mr: 1}} component="span">
                                                        Advertencia:
                                                    </Typography> 
                                                    Articulo cerca del stock mínimo.
                                                </Typography>
                                            </Typography>
                                        </li>
                                        <li>
                                            <Typography variant="h6" color="primary" alignItems="center" flex>
                                                <Typography component="span" color="#D0302A">
                                                    <Icon path={iconPath} size={.9} />
                                                </Typography>
                                                <Typography sx={{ml: 2}} component="span" color="text.primary">
                                                    <Typography sx={{fontWeight: "bold", mr: 1}} component="span">
                                                        Alerta:
                                                    </Typography> 
                                                    Articulo igual o por debajo del stock mínimo.
                                                </Typography>
                                            </Typography>
                                        </li>
                                    </ul>
                                </div>
                            }

                            {loading &&
                                <Loader />
                            }
                        
                        </CardContent>
                    </Card>
                }

                {loading &&
                    <Card sx={{py: 3, px: 5}}>
                        <Loader />
                    </Card>
                }
            </Grid>

        </Container>
        </Page>
    );
}


export default Inventario;