import {useState, useEffect} from "react"
import * as Yup from 'yup';
import { useFormik, Form, FormikProvider } from 'formik';

// material
import { Box, Grid, Stack, ButtonGroup, Tooltip, Container, Typography, Alert,  Card, CardContent, Hidden, Button, Modal, TextField, Checkbox, Select, MenuItem, InputLabel, FormControl } from '@mui/material';
import { DataGrid, DataGridProps } from '@mui/x-data-grid';
import { Link, useLocation } from 'react-router-dom';

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

import ExportExcel from "react-export-excel"
import AddArticleModal from "./modal/AddArticleModal";
import AddInventoryModal from "./modal/AddInventoryModal";
import ChangePublishedStatusModal from "./modal/ChangePublishedStatusModal";

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

    const [openModalAddItem, setopenModalAddItem]           = useState(false);
    const [openModalPublishItem, setopenModalPublishItem]   = useState(false);

    const [alertSuccessMessage, setalertSuccessMessage] = useState("");
    const [alertErrorMessage,   setalertErrorMessage]   = useState("");

    // const [editingItemInTable, seteditingItemInTable]   = useState(null);
    const [changeInputStock, setchangeInputStock]       = useState(false);

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

            // console.log("---Data---");
            // console.log(res);

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
        console.log("Edit", data);

        // setFieldValue("name",           data.article.name);
        // setFieldValue("description",    data.article.description);

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
        setopenModalAddItem(true);
    }

    let iconPath =  require('@mdi/js')['mdiCheckboxBlank'];

    let columns = [
        // { field: 'id',          headerName: 'ID', width: 70 },
        { 
            editable: true,
            field: 'article.name',     
            headerName: 'Nombre',
            maxWidth: 250,
            minWidth: 200,
            flex: 1,
            sortable: false,
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
                            {data.row.article.name} &nbsp; <i className="mdi mdi-pencil" />
                        </Typography>
            }
        },        
        { 
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
        },
        { 
            
            field: 'price',    
            headerName: 'Precio',
            sortable: false,
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
                                Bs. {price}
                            </Typography>
                        </Tooltip>
            }
        },
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
            */
        },
        { 
            editable: true,
            field: 'almacen',     
            headerName: `Disponible`,
            maxWidth: 130,
            minWidth: 100,
            flex: 1,
            sortable: false,
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
            sortable: false,
            renderCell: (cellValues) => {
                let data = cellValues;
                let text = data.row.asignados;
                return <Typography>
                    {text === null ? 0 : text}
                </Typography>
            }
        },
        { 
            field: 'id',    
            headerName: 'Acción',
            sortable: false,
            maxWidth: 120,
            minWidth: 120,
            flex: 1,
            headerAlign: 'center',
            renderCell: (cellValues) => {
                let isPublished = cellValues.row.isPublished;

                return <Button
                    variant="contained" 
                    color="primary" 
                    onClick={() => editPublishedItem(cellValues.row)}
                >
                    {isPublished ? 'Ocultar' : 'Publicar'}
                </Button>
            }
        },
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
            // config
        ).then((res) => {

            // setsending(false);
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
        // console.log(params);
        let dataBeforeEdit = params.row;
        if(dataBeforeEdit[params.field] !== params.value){

            console.log("Edit");
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
            
            // console.log(list);
            // console.log(index);
            // console.log(list[index]);

            item.existence  = newCount;
            list[index]     = item;


            setlist(list);
            setcount(count * 20);
        }
    }

    const handleCloseModalAddItem = () => {
        setopenModalAddItem(false);
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
                <AddInventoryModal 
                    show={openModalAddItem}
                    handleShowModal={(show) => {
                        setopenModalAddItem(false);
                    }}
                    permissions={permissions}
                    edit={itemToEdit}
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
                                        Añadir inventario
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

/*
    <Grid container alignItems="center">
                <Grid xs={4} item sx={{px: .5}}>
                    <Button disabled={sending} onClick={() => changeStock(data.row.id, count - 1)} type="button" size="small" sx={{py: 1.5, px: 0, minWidth: 0, width: "100%"}} color="primary" variant="contained">
                        <Icon icon={CaretLeft} />
                    </Button>
                </Grid>
                <Grid xs={4} item>
                    <TextField
                        hiddenLabel
                        size='small'
                        fullWidth
                        autoComplete="lastname"
                        type="number"
                        label=""
                        sx={{ borderColor: colorAlert}}
                        InputProps={{
                            readOnly: true,
                            style: {textAlign: 'center', color: colorAlert}
                        }}
                        value={count}
                    />
                </Grid>
                <Grid xs={4} item sx={{px: .5}}>
                    <Button disabled={sending} onClick={() => changeStock(data.row.id, count + 1)} type="button" size="small" sx={{py: 1.5, px: 0, minWidth: 0, width: "100%"}} color="primary" variant="contained">
                        <Icon icon={CaretRight} />
                    </Button>
                </Grid>
    </Grid>
*/