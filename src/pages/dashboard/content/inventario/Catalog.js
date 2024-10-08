import {useState, useEffect} from "react"
import { Link, useLocation } from 'react-router-dom';
import Excel from 'exceljs';
import { saveAs } from 'file-saver';
import moment from "moment";

// material
import { Box, Grid, Stack, ToggleButtonGroup,ButtonGroup, Tooltip, Container, Typography, Alert,  Card, CardContent, Hidden, Button, Modal, TextField, Checkbox, Select, MenuItem, InputLabel, FormControl } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';


// components
import Page from '../../../../components/Page';
import axios from "../../../../auth/fetch"
import Loader from '../../../../components/Loader/Loader';
import { getPermissions } from "../../../../utils/getPermissions";
import { useSelector } from "react-redux";
import { toast } from 'react-toastify';
import ListStockModal from "./modal/ListStockModal";


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
    const [openListStockModal, setOpenListStockModal]           = useState(false);
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
    useEffect(() => { // actualiza cada minuto
       
        const interval = setInterval( async () => {            
            await getList();            
        }, 10000);
      
        return () => clearInterval(interval);
      }, []);

    const editItem = (data) => {
        settypeForm("edit");
        setitemToEdit(data);
        setOpenListStockModal(true);
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
        setOpenListStockModal(true);
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
                    onClick={() => openModal(params.row)} 
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
            field:"des",
            headerName: `Descarga`, 
            headerAlign: 'center',
            align:'center',
            sortable: false,    
            maxWidth: 160,
            minWidth: 160,               
            renderCell: (params) => (              
                <div>
                   
                    <Button
                    variant="contained"                        
                    color="primary" 
                    onClick={() =>saveExcel(params.row)}
                    >
                        XLS
                    </Button>                         
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
                // setopenListStockModal(false);
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
        setOpenListStockModal(false);
        setopenModalPublishItem(false);
        setitemToEdit(null);
    }
    const columnsXLS = [
        { header: '#', key: 'numItem' },
        { header: 'Especie', key: 'name' },
        { header: 'Peso Kg', key: 'weight' },
        { header: 'Precio $ ', key:'price'},
        { header: 'note', key: 'note' },
        { header: 'Momento', key: 'dateFile' }, 
        { header: 'code', key: 'id' }
      ]; 
    const workSheetName = 'BM';    
    const workbook = new Excel.Workbook(); 
    const saveExcel = async (rowStock) => {
         try {           
            // getStockArticle(artId);                 
            let stockdata=[];
            stockdata=list.filter(stock =>stock.id===rowStock.id); 
            let formatedStockdata=[];
            for (let index = 0; index < stockdata.length; index++) {
                if(stockdata[index].isActived){ // discrimina lotes activos
                    for (let jindex = 0; jindex < stockdata[index].lots.length; jindex++) {                         
                        for (let kindex = 0; kindex < stockdata[index].lots[jindex].itemLots.length; kindex++) {                                                                         
                            if(stockdata[index].lots[jindex].itemLots[kindex].conditionId===1){ // discrimina Items disponible
                                //                formatedDataStock.push(dataStock[index].itemLots[kindex])
                                formatedStockdata.push({
                                    name:stockdata[index].name,
                                    price:stockdata[index].price,
                                    isActived:stockdata[index].isActived,
                                    dateFile:moment().format('l') +":"+moment().format('LT') , // momento de dato
                                    weight:stockdata[index].lots[jindex].itemLots[kindex].weight,
                                    note:stockdata[index].lots[jindex].itemLots[kindex].note,
                                    numItem:stockdata[index].lots[jindex].itemLots[kindex].numItem,
                                    id:stockdata[index].lots[jindex].itemLots[kindex].id
                                })
                            }
                        }
                    }
                }                
            }
            if(formatedStockdata && formatedStockdata.length>0){
                
                const fileName = formatedStockdata.length>0?formatedStockdata[0].name +"-"+ moment().format('YYY-MM-DD') : 'stock' ;                
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
                worksheet.getColumn('F').width= 25;
                worksheet.getColumn('E').width= 15;                
                worksheet.addRow(2).values = ['#', 'Especie', 'Peso Kg', 'Precio $', 'Nota', 'Momento', 'Código']
                worksheet.getCell(`A1`).value = "Stock de "+formatedStockdata[0].name +" ( "+formatedStockdata.length+" )"; // Assign title to cell A1 -- THIS IS WHAT YOU'RE LOOKING FOR.
                worksheet.mergeCells('A1:G1'); // Extend cell over all column headers
                worksheet.getCell(`A1`).alignment = { horizontal: 'center' }; // Horizontally center your text
                 
                // loop through data and add each one to worksheet                
                // worksheet.header=['#','Especie','Peso','Precio','Nota','FechadateFile','Código'];
                
                formatedStockdata.forEach(singleData => {
                worksheet.addRow(singleData);
                }); 
                worksheet.getRow(1).font = { bold: true,size:20 };
                worksheet.getRow(2).font = { bold: true };
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
                toast.success("Descargando XLS: "+ formatedStockdata[0].name) ;
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
          
            {openListStockModal && 
                <ListStockModal
                    show={openListStockModal}
                     handleShowModal={(show) => {
                        setOpenListStockModal(false);
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