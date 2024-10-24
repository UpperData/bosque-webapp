import {useState, useEffect} from "react"
import { useLocation } from 'react-router-dom';
import Excel from 'exceljs';
import { saveAs } from 'file-saver';
import moment from "moment";

// material
import { Box, Grid,  Tooltip, Container, Typography, Alert,  Card, CardContent, Hidden, Button } from '@mui/material';
import { DataGrid  } from '@mui/x-data-grid';


// components
import Page from '../../../../components/Page';
import axios from "../../../../auth/fetch"
import Loader from '../../../../components/Loader/Loader';

import { getPermissions } from "../../../../utils/getPermissions";
import { useSelector } from "react-redux";
import ExportExcel from "react-export-excel"
import AddArticleModal from "./modal/AddArticleModal";
import ChangePublishedStatusModal from "./modal/ChangePublishedStatusModal";
import LotesArticleModal from "./modal/LotesArticleModalFull";

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
    // const [items,setItems]                              =useState("[{}]");;
   
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
            headerName: 'ID',
            maxWidth: 50,
            minWidth: 50,
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
            sortable: false,
            filterable: false,
            headerAlign: 'center',
            renderCell: (cellValues) => {
                let data = cellValues;                
                return  <div className=" container mx-auto overflow-hidden h-10 w-14 opacity-50 " > 
                    <img               
                        src={`${cellValues.row.image}`}
                        alt={cellValues.row.name}
                        loading="lazy"
              />
                </div>
                
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
                            onClick={() => openModal(data.row)}
                            /* onClick={() => editItem
                                (data.row)}  */
                        >
                            {data.row.name.toUpperCase()} &nbsp; <i className="mdi mdi-pencil" />
                        </Typography>
            }
        },   
        { 
            editable: true,
            field: 'isActived',     
            headerName: 'Status',
            maxWidth: 80,
            minWidth: 60,
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
                            {data.row.isActived?"Activo":"Inactivo"}
                        </Typography>
            }
        },                
        { 
            
            field: 'price',    
            headerName: 'Precio Kg',
            sortable: true,
            maxWidth: 100,
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
        },         
        { 
            editable: false,
            field: 'almacen',     
            headerName: 'Disponible',
            maxWidth: 100,
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
            headerName: `Reservados`,
            maxWidth: 90,
            minWidth: 90,
            flex: 1,
            sortable: true,
            headerAlign: 'center'
        },{ 
            field: 'lotes',    
            headerName: '',            
            maxWidth: 120,
            minWidth: 120,
            align: 'center',
            flex: 1,
            sorteable:false,
            filterable: false,
            headerAlign: 'center',
            renderCell: (cellValues) => {
                let data = cellValues;
                return <Button                    
                    variant="contained"
                    color="primary" 
                    onClick={() => editItem
                        (data.row)} 
                >
                    Lotes
                </Button>
            }
        },        
        { 
            field: 'isPublished',    
            headerName: '',
            sortable: true,
            maxWidth: 120,
            minWidth: 120,
            align: 'center',
            flex: 1,
            headerAlign: 'center',
            filterable: false,
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
        },{
            headerName: ``, 
            headerAlign: 'center',  
            align: 'center',  
            maxWidth: 90,
            minWidth: 90,
            sortable:false,
            filterable: false,  
            renderCell: (cellValues) => {              
                let data = cellValues
                return <div>
                    {
                        <Button
                        variant="contained"                        
                        color="primary" 
                        onClick={() =>saveExcel(data.row.id)}
                        >
                            XLS
                        </Button>
                    /* <ToggleButtonGroup>
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
                    </ToggleButtonGroup>  */}  
                </div>
            }
            
            
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

    let  items = list !== null ? list.filter(item => item.hasOwnProperty("id")) : [];

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
        { header: '#', key: 'lots.itemLots.numItem' },
        { header: 'Especie', key: 'name' },
        { header: 'Peso Kg', key: 'lots.itemLots.weight' },
        { header: 'Precio $ ', key:'weightPrice'},
        { header: 'note', key: 'lots.itemLots.note' },
        { header: 'code', key: 'lots.itemLots.id' }
      ];
 

      
    const getStockArticle= async (art)=>{                
        const url = "/INVETORY/get/Article/"+art;
        let rs=[];
        await axios.get(url).then((res) => {        
             if(res.result){                 
                setStockdata(res.data);
                rs=res.data;
             }else{
                setStockdata([]);
                rs=[];
             }
         }).catch((err) => {
             console.error(err);             
         }); 
         return rs;         
    }
    
    const workSheetName = 'BM';    
    const workbook = new Excel.Workbook();     
    const saveExcel = async (artId) => {

         try {           
            let currStock= await getStockArticle(artId)                        
            if(currStock && currStock.length>0){
                
                const fileName = currStock.length>0?currStock[0].name +"-"+ moment().format('YYY-MM-DD') : 'stock' ;                
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
                worksheet.addRow(2).values = ['#', 'Especie', 'Peso Kg', 'Precio (Aprox.)', 'Nota', 'Código']
                worksheet.getCell(`A1`).value = "Stock de "+currStock[0].name +" ( "+currStock.length+" )"; // Assign title to cell A1 -- THIS IS WHAT YOU'RE LOOKING FOR.
                worksheet.mergeCells('A1:F1'); // Extend cell over all column headers
                worksheet.getCell(`A1`).alignment = { horizontal: 'center' }; // Horizontally center your text
                // loop through data and add each one to worksheet
                currStock.forEach(singleData => {
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
                    actionType={typeForm}
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
                                    <Button 
                                        onClick={() => openModal({id:0})} 
                                        variant="contained" 
                                        color="primary" 
                                        fullWidth sx={{px : 3}} 
                                        size="normal"
                                    >
                                        Añadir especie
                                    </Button>
                                </Grid>
                                <Grid>
                                    
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

                            <Grid container columnSpacing={3} justifyContent="end">
                                {/* <Grid md="auto" item xs={12} sx={{mb: 2}}>
                                    Total 
                                    <Typography sx={{fontWeight: "bold", ml: 1}} component="span">
                                        Bs {data.bolivaresTotalInventory}
                                    </Typography> 
                                </Grid> */}
                                {/* <Grid md="auto" item xs={12} sx={{mb: 2}}>
                                    Inventario total
                                    <Typography sx={{fontWeight: "bold", ml: 1, align:"left"}} component="span">
                                        USD ${data.dolarTotalInventory}
                                    </Typography> 
                                </Grid> */}
                            </Grid>
                            
                            <div style={{display: 'table', tableLayout:'fixed', width:'100%'}}> 
                                <DataGrid 
                                    sx={{mb:12}}
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
                                    autoPageSize
                                    rowCount={items.length}

                                    // disableColumnFilter
                                    // disableColumnMenu
                                    autoHeight 
                                    disableColumnSelector
                                    disableSelectionOnClick
                                    // editable
                                    // checkboxSelection
                                />
                            </div>

                                    {/* <ul style={{listStyle: "none"}}>
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
                                    </ul> */}
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