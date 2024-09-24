import {useState, useEffect} from "react"
import { useFormik, Form, FormikProvider } from 'formik';
import { Link, useLocation } from 'react-router-dom';
import Excel from 'exceljs';
import { saveAs } from 'file-saver';
import moment, { updateLocale } from "moment";

// material
import { Box, Grid, Stack, ToggleButtonGroup,ButtonGroup, Tooltip, Container, Typography, Alert,  Card, CardContent, Hidden, Button, Modal, TextField, Checkbox, Select, MenuItem, InputLabel, FormControl } from '@mui/material';
import { DataGrid, DataGridProps } from '@mui/x-data-grid';


// components
import Page from '../../../../components/Page';
import axios from "../../../../auth/fetch"
import Loader from '../../../../components/Loader/Loader';
import { getPermissions } from "../../../../utils/getPermissions";
import { useSelector } from "react-redux";
import { toast } from 'react-toastify';
import ExportExcel from "react-export-excel"
import AddArticleModal from "./modal/AddArticleModal";
import ChangePublishedStatusModal from "./modal/ChangePublishedStatusModal";
import LotesArticleModal from "./modal/LotesArticleModalFull";
import { parseJSON } from "date-fns";
import { da } from "date-fns/locale";

const ExcelJS = require("exceljs");

const ExcelFile     = ExportExcel.ExcelFile;
const ExcelSheet    = ExportExcel.ExcelSheet;
const ExcelColumn   = ExportExcel.ExcelColumn;

// ----------------------------------------------------------------------

function Catalog() {

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
    // const [items,setItems]                              =useState("[{}]");;
   
    const urlGetData        = "/Inventory/get/*/true/true/1" // "/InveTorY/get/ALL";
    const urlEditItemData   = "/InvEToRY/UpdaTE/ARTICLE";

    // Permissions
    const location                              = useLocation();
    let MenuPermissionList                      = useSelector(state => state.dashboard.menu);
    let permissions                             = getPermissions(location, MenuPermissionList);

    const getList = async () => {

        setsearch(true);
        axios.get(urlGetData)
        .then((res) => {  
            if(res.result){
                setdata(res.data);
                setlist(res.data);
                setsending(false);
                setloading(false);
                /* let dta=res.data;
                let qty="";
                for (let index = 0; index < dta.length; index++) {                
                    for (let kindex = 0; kindex < dta.length; kindex++) {
                        
                        dta[index].stock= dta[index].lots[kindex].itemLots.length
                       // qty=dta[index].lots[kindex].itemLots.length;
                    }
                    // dta[index]['stock']=qty;
                } */
               console.log("ls")
                console.log(res.data) 
            }               
             
            
                       
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

    const openModal = (current) => {
        
        if(current.id>0){            
            settypeForm("edit");
            setitemToEdit(current);
        }else{            
            setitemToEdit({});        
            settypeForm("create");
        }
        
        
        
        // setopenModalAddItem(true);
        setOpenModalArticle(true);
    }
    
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
                            onClick={() => openModal(data.row)}
                        >
                            {data.row.id} &nbsp; <i className="mdi mdi-pencil" />
                        </Typography>
            }
        },
 
        { 
            editable: true,
            field: 'image',     
            headerName: 'Imagen',
            maxWidth: 250,
            minWidth: 200,
            flex: 1,
            sortable: true,
            headerAlign: 'center',
            renderCell: (cellValues) => {
                let data = cellValues;                
                return  <div className=" container mx-auto overflow-hidden h-10 w-14 " > 
                    <img               
                        src={`${cellValues.row.image}`}
                        alt={cellValues.row.name}
                        loading="lazy"
              />
                </div>
                
            }
        },  
        { 
            
            field: 'name',    
            headerName: 'Especie',
            sortable: true,
            maxWidth: 150,
            minWidth: 100,
            flex: 1,
            headerAlign: 'center',
            editable: true,
            type: 'number',
            renderCell: (cellValues) => { 
                let data = cellValues;                
                return <Typography>
                                {cellValues.row.name}
                        </Typography>
                        
            }
        },       
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
                let price = cellValues.row.price;               
                return <Typography>
                            $ {price}
                        </Typography>
                        
            }
        },
        {
            field:'stock',
            headerName: `Stock`,            
            sortable: false,
            headerAlign: 'center',    
            maxWidth: 160,
            minWidth: 160,   
            renderCell: (cellValues) => {              
                let unid= cellValues.row.isSUW?"Uds":"kg";
                return  <Typography>
                        {cellValues.row.stock } {cellValues.row.isSUW?" Uds":" Kg"} 
                        </Typography>
            }
            
            
        },
        {
            field:'',
            sortable: false,
            headerAlign: 'center',                
            maxWidth: 160,
            minWidth: 160,   
            renderCell: (params) => (              
                <div>
                    <Button 
                    onClick={() => openModal({id:0})} 
                    variant="contained" 
                    color="primary" 
                    fullWidth sx={{px : 3}} 
                    size="normal"
                >
                        Detalle
                    </Button>                    
                </div>
            )
        },
        {
              
            headerName: `Descarga`, 
            headerAlign: 'center',
            sortable: false,    
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
            
            
        }
        
    ];
    
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

    // let  items = list !== null ? list.filter(item => item.hasOwnProperty("id")) : [];



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
                    Catalogo
                </Typography>
            </Box>

            {openModalPublishItem &&
                <ChangePublishedStatusModal 
                    show={openModalPublishItem}
                    handleShowModal={(show) => {
                        setopenModalPublishItem(false);
                    }}
                    // edit={itemToEdit}
                    reset={() => resetList()}
                />
            }

            {openModalAddItem &&
                <LotesArticleModal 
                    // show={openModalAddItem}
                     handleShowModal={(show) => {
                        setopenModalAddItem(show);
                    }} 
                    // permissions={permissions}
                    // edit={itemToEdit}
                    // actionType={typeForm}
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
                    edit={itemToEdit}
                    actionType={typeForm} 
                
                />
            }
            
            <Grid sx={{ pb: 3 }} item xs={12}>
                {!loading &&
                    <Card>
                        <CardContent>
                            <Grid container justifyContent="space-between" columnSpacing={1}>                                
                                <Grid sx={{mb: 2}} item md={3} xs={12}>
                                    
                                    <Button variant="contained"
                                    onClick={() => getList()} >
                                    Actualizar
                                    </Button>

                                </Grid>
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

                            
                                    <div style={{display: 'table', tableLayout:'fixed', width:'100%'}}> 
                                        <DataGrid 
                                            sx={{mb:12}}
                                            rows={list}
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
                                            autoPageSize
                                            rowCount={list.length}

                                            // disableColumnFilter
                                            // disableColumnMenu
                                            autoHeight 
                                            disableColumnSelector
                                            disableSelectionOnClick
                                            // editable
                                            // checkboxSelection
                                        />
                                    </div>                                    
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


export default Catalog;